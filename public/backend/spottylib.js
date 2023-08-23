const axios = require('axios');
const fluent_ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const node_id3 = require('node-id3');
const ytdl_core = require('ytdl-core');
const ytmusic_api = require('ytmusic-api');

const ytm = new ytmusic_api.default();
ytm.initialize();

async function dl_track(id, filename, callback) {
	return new Promise(resolve => {
		try {
			fluent_ffmpeg(ytdl_core(id, { quality: 'highestaudio', filter: 'audioonly' }).on('end', () => callback(3)))
				.audioBitrate(128)
				.save(filename)
				.on('error', (err) => {
					console.error(`Failed to write file (${filename}): ${err}`);
					fs.unlinkSync(filename);
					resolve(false);
				})
				.on('end', () => {
					resolve(true);
				});
		}
		catch {
			resolve(false);
		}
	});
};

async function get_album_playlist(playlistId) {
	let properUrl = `https://m.youtube.com/playlist?list=${playlistId}`;
	let resp = await axios.get(properUrl);
	let ytInitialData = JSON.parse(/(?:window\["ytInitialData"\])|(?:ytInitialData) =.*?({.*?});/s.exec(resp.data)?.[1] || '{}');
	let listData = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer
		.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer;
	return listData.contents;
};

async function dl_album(album, oPath, tags, callback) {
	const alb = await ytm.searchAlbums(`${album.artists[0].name} - ${album.name}`);
	const yt_tracks = await get_album_playlist(alb[0].playlistId);
	let i = 0;
	for (let res of album.tracks.items) {
		const YTID = yt_tracks[i].playlistVideoRenderer.videoId;
		let filename = `${oPath}${res.id}.mp3`;
		callback({ id: res.id, status: 'Started' });
		try {
			fluent_ffmpeg(ytdl_core(YTID, { quality: 'highestaudio', filter: 'audioonly' }))
				.audioBitrate(128)
				.save(filename)
				.on('error', () => {
					tags.title = res.name;
					tags.trackNumber = res.track_number;
					callback({ id: res.id, status: 'Errored' });
					fs.unlinkSync(filename);
				})
				.on('end', () => {
					tags.title = res.name;
					tags.trackNumber = res.track_number;
					if (node_id3.update(tags, filename)) {
						callback({ id: res.id, status: 'Finished' });
					} else {
						callback({ id: res.id, status: 'Errored' });
					}
					i++;
					if (i == album.tracks.items.length) {
						callback({ id: album.id, status: 'Ended' });
					}
				});
		}
		catch {
			callback({ id: res.id, status: 'Errored' });
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

async function downloadTrack(track, outputPath, callback) {
	try {
		let albCover = await axios.get(track.album.images[0].url, { responseType: 'arraybuffer' });
		let tags = {
			title: track.name,
			artist: getArtistList(track.artists),
			album: track.album.name,
			year: track.album.release_date,
			trackNumber: track.track_number,
			image: {
				imageBuffer: Buffer.from(albCover.data, 'utf-8')
			}
		};
		let filename = `${outputPath}${track.id}.mp3`;
		let id = (await ytm.searchSongs(`${track.name} - ${track.artists[0].name}`))[0].videoId;
		callback({ id: track.id, status: 'Started' });
		let dlt = await dl_track(id, filename, callback);
		if (dlt) {
			let tagStatus = node_id3.update(tags, filename);
			if (tagStatus) {
				callback({ id: track.id, status: 'Finished' });
			}
			else {
				callback({ id: track.id, status: 'Errored' });
			}
		}
		else {
			callback({ id: track.id, status: 'Errored' });
		}
	}
	catch {
		callback({ id: track.id, status: 'Errored' });
	}
};

async function downloadAlbum(album, outputPath, callback) {
	try {
		let albCover = await axios.get(album.images[0].url, { responseType: 'arraybuffer' });
		let tags = {
			artist: album.artists[0].name,
			album: album.name,
			year: album.release_date,
			image: {
				imageBuffer: Buffer.from(albCover.data, 'utf-8')
			}
		};
		await dl_album(album, outputPath, tags, callback);
	}
	catch {
		callback({ id: album.id, status: 'Errored' });
	}
};

class spottylib {
	accessToken;
	clientId;
	downloadTrack;
	downloadAlbum;
	constructor() {
		this.accessToken = null;
		this.clientId = null;
		this.downloadTrack = downloadTrack;
		this.downloadAlbum = downloadAlbum;
	}

	async auth() {
		let re = /<script id="session" data-testid="session" type="application\/json"\>({.*})<\/script>/;
		let response = await axios("https://open.spotify.com/search")
			.then(data => data.data.match(re)[1])
			.then(json => JSON.parse(json))
			.catch(() => {
				return false;
			});

		if (!response) {
			return false;
		}

		this.accessToken = response.accessToken;
		this.clientId = response.clientId;
		return true;
	}

	async getTrack(id) {
		return await axios('https://api.spotify.com/v1/tracks/' + id, {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
			.then(data => data.data)
			.catch(() => null);
	}

	async getAlbum(id) {
		return await axios('https://api.spotify.com/v1/albums/' + id, {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
			.then(data => data.data)
			.catch(() => null);
	}

	async getArtist(id) {
		return await axios('https://api.spotify.com/v1/artists/' + id, {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
			.then(data => data.data)
			.catch(() => null);
	}

	async searchTrack(search) {
		return await axios('https://api.spotify.com/v1/search?q=' + search + '&type=track', {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
			.then(data => data.data.tracks.items)
			.catch(() => null);
	}

	async searchAlbum(search) {
		return await axios('https://api.spotify.com/v1/search?q=' + search + '&type=album', {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
			.then(data => data.data.albums.items)
			.catch(() => null);
	}

	async searchArtist(search) {
		return await axios('https://api.spotify.com/v1/search?q=' + search + '&type=artist', {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
			.then(data => data.data.artists.items)
			.catch(() => null);
	}
}

module.exports = { spottylib };