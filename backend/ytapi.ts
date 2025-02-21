import YT_downloader from '@distube/ytdl-core'; // @ts-ignore
import { getTrackData } from '@hydralerne/youtube-api';
import YT_music from 'ytmusic-api';

import fluent_ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import client from 'https';
import * as id3 from 'node-id3';
import path from 'path';

import { VIDEO_DIR } from '..';
import JobList from '../Classes/JobList';
import { JobEndStatus, SongData } from '../declarations';
import { checkFile } from './utils';

function download_file(trackId: string, filename: string) {
	return new Promise(resolve => {
		try {
			if (fs.existsSync(filename)) resolve(true);
			fluent_ffmpeg(
				YT_downloader('https://music.youtube.com/watch?v=' + trackId, {
					quality: 'highestaudio',
					filter: 'audioonly'
				}),
				{ logger: undefined }
			)
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

class YT_API {
	private ytm: YT_music;
	readonly jobs: JobList;
	constructor() {
		this.ytm = new YT_music();
		this.ytm.initialize();
		this.jobs = new JobList();
	}

	async search(query: string) {
		try {
			return await this.ytm.searchSongs(query);
		} catch {
			return undefined;
		}
	}

	async getImage(url: string) {
		return new Promise<Buffer | undefined>(async resolve => {
			const data = new Array<any>();
			try {
				client.get(url, res => {
					res.on('data', chunk => {
						data.push(chunk);
					}).on('end', () => {
						resolve(Buffer.concat(data));
					});
				});
			} catch (err) {
				console.error('Exception: ' + err);
				resolve(undefined);
			}
		});
	}

	async downloadTrack(id: string) {
		if (checkFile(id)) return 'Done';
		if (this.jobs.has(id)) {
			return new Promise<JobEndStatus>(resolve => {
				this.jobs.on(id, resolve);
			});
		}

		this.jobs.add(id);

		const filename = path.join(VIDEO_DIR, `${id}.mp3`);
		try {
			const track: SongData = await getTrackData(id);
			const album = await this.ytm.getAlbum(track.albumID);
			const cover = await this.getImage(album.thumbnails[album.thumbnails.length - 1].url ?? track.posterLarge);

			if (!cover) {
				throw 'Unable to get album cover';
			}

			if (await download_file(id, filename)) {
				const tagStatus = id3.update(
					{
						generalObject: [],
						title: track.title,
						artist: track.artist,
						album: track.album,
						year: album.year?.toString(),
						image: {
							description: 'Album cover',
							mime: '',
							imageBuffer: cover,
							type: {
								id: 0
							}
						}
					},
					filename
				);
				if (!tagStatus) {
					throw 'Error when updating tags';
				}
			} else {
				throw 'Error when downloading file';
			}

			this.jobs.delete(id, 'Done');
			return 'Done';
		} catch (err) {
			console.error(`Exception: ${err}`);
			if (fs.existsSync(filename)) fs.unlinkSync(filename);
			this.jobs.delete(id, 'Errored');
			throw 'Errored';
		}
	}
}

export default YT_API;
