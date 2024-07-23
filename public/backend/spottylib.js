const axios = require('axios');
const client = require('https');
const fluent_ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const node_id3 = require('node-id3');
const ytdl_core = require('@distube/ytdl-core');
const ytmusic_api = require('ytmusic-api');

const ytm = new ytmusic_api.default();
ytm.initialize();

const PATH = './datas/';

function addTrackDatas(track) {
	try {
		const datas = new Map(JSON.parse(fs.readFileSync(PATH + 'tracks.json')));
		datas.set(track.id, track);
		fs.writeFileSync(PATH + 'tracks.json', JSON.stringify(Array.from(datas.entries())));
		return true;
	} catch (err) {
		console.error('Exception: ' + err);
		return false;
	}
}

function removeTrackDatas(TrackID) {
	try {
		const datas = new Map(JSON.parse(fs.readFileSync(PATH + 'tracks.json')));
		datas.delete(TrackID);
		fs.writeFileSync(PATH + 'tracks.json', JSON.stringify(Array.from(datas.entries())));
		return true;
	} catch (err) {
		console.error('Exception: ' + err);
		return false;
	}
}

async function dl_track(id, filename) {
	return new Promise(resolve => {
		try {
			if (fs.existsSync(filename)) resolve(true);
			fluent_ffmpeg(ytdl_core(id, { quality: 'highestaudio', filter: 'audioonly' }))
				.audioBitrate(128)
				.save(filename)
				.on('error', err => {
					console.error(`Failed to download file (${filename}): ${err}`);
					if (fs.existsSync(filename)) {
						fs.unlinkSync(filename);
					}
					resolve(false);
				})
				.on('end', () => {
					resolve(true);
				});
		} catch (err) {
			console.error(`Error: ${err}`);
			if (fs.existsSync(filename)) fs.unlinkSync(filename);
			resolve(false);
		}
	});
}

async function get_album_playlist(playlistId) {
	let properUrl = `https://m.youtube.com/playlist?list=${playlistId}`;
	let resp = await axios.get(properUrl);
	let ytInitialData = JSON.parse(
		/(?:window\["ytInitialData"\])|(?:ytInitialData) =.*?({.*?});/s.exec(resp.data)?.[1] || '{}'
	);
	let listData =
		ytInitialData?.contents?.twoColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer
			?.contents[0]?.itemSectionRenderer?.contents[0]?.playlistVideoListRenderer;
	return listData?.contents?.map(el => el?.playlistVideoRenderer?.videoId);
}

async function dl_album(album, tags, callback) {
	const alb = await ytm.searchAlbums(`${album.artists[0].name} - ${album.name}`);
	const yt_tracks = await get_album_playlist(alb[0].playlistId);
	let i = 0;
	for (let res of album.tracks.items) {
		const YTID = yt_tracks[i].playlistVideoRenderer.videoId;
		let filename = `${PATH}tracks/${res.id}.mp3`;
		callback({ id: res.id, status: 'Started' });
		try {
			if (!fs.existsSync(filename))
				fluent_ffmpeg(ytdl_core(YTID, { quality: 'highestaudio', filter: 'audioonly' }))
					.audioBitrate(128)
					.save(filename)
					.on('error', () => {
						tags.title = res.name;
						tags.trackNumber = res.track_number;
						callback({ id: res.id, status: 'Errored' });
						if (fs.existsSync(filename)) fs.unlinkSync(filename);
					})
					.on('end', () => {
						tags.title = res.name;
						tags.trackNumber = res.track_number;
						if (node_id3.update(tags, filename)) {
							callback({ id: res.id, status: 'Finished' });
						} else {
							if (fs.existsSync(filename)) fs.unlinkSync(filename);
							callback({ id: res.id, status: 'Errored' });
						}
						i++;
						if (i == album.tracks.items.length) {
							callback({ id: album.id, status: 'Ended' });
						}
					});
		} catch (err) {
			console.error(`Exception: ${err}`);
			if (fs.existsSync(filename)) fs.unlinkSync(filename);
			callback({ id: track.id, status: 'Errored' });
		}
	}
}

function getArtistList(artists) {
	let ArtistString = '';
	artists.forEach((art, i) => {
		if (i) ArtistString += '/';
		ArtistString += art.name;
	});
	return ArtistString;
}

async function getYoutubeID(track) {
	const duration = track.duration_ms / 1000;

	let content = await ytm.searchSongs(`${track.name} ${track.artists.map(artist => artist.name).join(' ')}`);

	// We only keep songs that match the duration to within 10 seconds
	content = content.filter(song => Math.abs(song.duration - duration) < 10);
	// We only keep songs with matching artist
	//content = content.filter(song => {
	//	if (song.artists.length) {
	//		return song.artists[0].name == track.artists[0].name;
	//	}
	//	return true;
	//});

	const explicitList = content.filter(song => song.isExplicit);
	const nonExplicitList = content.filter(song => !song.isExplicit);
	if (track.explicit) {
		if (explicitList.length > 0) {
			content = explicitList;
		} else {
			content = nonExplicitList;
		}
	} else {
		if (nonExplicitList.length > 0) {
			content = nonExplicitList;
		} else {
			content = explicitList;
		}
	}

	return content.length < 1 ? null : content[0].videoId;
}

async function downloadImages(album) {
	return new Promise(resolve => {
		album.images.forEach((image, i) => {
			client.get(image.url, res => {
				if (res.statusCode === 200) {
					const filename = `${PATH}images/x${i + 1}/${album.id}.jpg`;
					try {
						res.pipe(fs.createWriteStream(filename, 'utf-8'));
					} catch (err) {
						if (fs.existsSync(filename)) fs.unlinkSync(filename);
						console.error('Exception: ' + err);
						resolve(false);
					}
				} else {
					res.resume();
					resolve(false);
				}
			});
		});
		resolve(true);
	});
}

async function getAlbumImage(album) {
	return new Promise(resolve => {
		const data = [];
		try {
			client.get(album.images[0].url, res => {
				res.on('data', chunk => {
					data.push(chunk);
				}).on('end', () => {
					resolve(Buffer.concat(data));
				});
			});
		} catch (err) {
			console.error('Exception: ' + err);
			resolve();
		}
	});
}

async function downloadTrack(track, callback) {
	const filename = `${PATH}tracks/${track.id}.mp3`;
	try {
		const images = downloadImages(track.album);
		const albCover = getAlbumImage(track.album);

		if (!(await albCover)) {
			callback({ id: track.id, status: 'Errored' });
			return;
		}
		const tags = {
			title: track.name,
			artist: getArtistList(track.artists),
			album: track.album.name,
			year: track.album.release_date,
			trackNumber: track.track_number,
			image: {
				imageBuffer: await albCover
			}
		};
		const id = await getYoutubeID(track);
		if (!id) {
			if (fs.existsSync(filename)) fs.unlinkSync(filename);
			callback({ id: track.id, status: 'Errored' });
			return;
		}
		if (!(await images)) {
			callback({ id: track.id, status: 'Errored' });
			return;
		}
		callback({ id: track.id, status: 'Started' });
		const dlt = await dl_track(id, filename);
		if (dlt) {
			let tagStatus = node_id3.update(tags, filename);
			if (tagStatus) {
				if (addTrackDatas(track)) callback({ id: track.id, status: 'Finished' });
				else callback({ id: track.id, status: 'Errored' });
			} else {
				if (fs.existsSync(filename)) fs.unlinkSync(filename);
				callback({ id: track.id, status: 'Errored' });
			}
		} else {
			if (fs.existsSync(filename)) fs.unlinkSync(filename);
			callback({ id: track.id, status: 'Errored' });
		}
	} catch (err) {
		console.error(`Exception: ${err}`);
		if (fs.existsSync(filename)) fs.unlinkSync(filename);
		callback({ id: track.id, status: 'Errored' });
	}
}

async function downloadAlbum(album, callback) {
	try {
		const albCover = await axios.get(album.images[0].url, { responseType: 'arraybuffer' });
		const tags = {
			artist: album.artists[0].name,
			album: album.name,
			year: album.release_date,
			image: {
				imageBuffer: Buffer.from(albCover.data, 'utf-8')
			}
		};
		await dl_album(album, tags, callback);
	} catch (err) {
		console.error(`Exception: ${err}`);
		callback({ id: track.id, status: 'Errored' });
	}
}

class spottylib {
	accessToken;
	options;
	downloadTrack;
	downloadAlbum;
	constructor() {
		this.accessToken = null;
		this.options = null;
		this.downloadTrack = downloadTrack;
		this.downloadAlbum = downloadAlbum;
	}

	async auth() {
		const re = /<script id="session" data-testid="session" type="application\/json"\>({.*})<\/script>/;
		const response = await axios('https://open.spotify.com/search')
			.then(data => data.data.match(re)[1])
			.then(json => JSON.parse(json))
			.catch(() => {
				this.accessToken = null;
				this.options = null;
				return false;
			});

		if (!response) {
			this.accessToken = null;
			this.options = null;
			return false;
		}

		this.accessToken = response.accessToken;
		this.options = {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			}
		};
		return true;
	}

	async catcher(URL, options, callback, err) {
		if (err?.response?.status) {
			console.log('Auth issue. Trying re-authenticate...');
			const v = await this.auth();
			if (v) {
				console.log('Authentication succeed');
				return await axios(URL, options).then(callback).catch();
			} else {
				console.error('Authentication failed');
			}
		} else {
			console.error('Exception: ' + err);
		}
	}

	async getTrack(id) {
		const URL = 'https://api.spotify.com/v1/tracks/' + id;

		const callback = data => data.data;

		return await axios(URL, this.options)
			.then(callback)
			.catch(err => this.catcher(URL, this.options, callback, err));
	}

	async getAlbum(id) {
		const URL = 'https://api.spotify.com/v1/albums/' + id;

		const callback = data => data.data;

		return await axios(URL, this.options)
			.then(callback)
			.catch(err => this.catcher(URL, this.options, callback, err));
	}

	async getArtist(id) {
		const URL = 'https://api.spotify.com/v1/artists/' + id;

		const callback = data => data.data;

		return await axios(URL, this.options)
			.then(callback)
			.catch(err => this.catcher(URL, this.options, callback, err));
	}

	async searchTrack(search) {
		const URL = 'https://api.spotify.com/v1/search?q=' + search + '&type=track';

		const callback = data => data.data.tracks.items;

		return await axios(URL, this.options)
			.then(callback)
			.catch(err => this.catcher(URL, this.options, callback, err));
	}

	async searchAlbum(search) {
		const URL = 'https://api.spotify.com/v1/search?q=' + search + '&type=album';

		const callback = data => data.data.albums.items;

		return await axios(URL, this.options)
			.then(callback)
			.catch(err => this.catcher(URL, this.options, callback, err));
	}

	async searchArtist(search) {
		const URL = 'https://api.spotify.com/v1/search?q=' + search + '&type=artist';

		const callback = data => data.data.artists.items;

		return await axios(URL, this.options)
			.then(callback)
			.catch(err => this.catcher(URL, this.options, callback, err));
	}

	removeTrack(TrackID) {
		if (fs.existsSync(PATH + 'tracks/' + TrackID + '.mp3')) {
			fs.unlinkSync(PATH + 'tracks/' + TrackID + '.mp3');
		}
		return removeTrackDatas(TrackID);
	}
}

module.exports = { spottylib, getYoutubeID, get_album_playlist };
