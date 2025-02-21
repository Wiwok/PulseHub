import axios from 'axios';
import { SongDetailed } from 'ytmusic-api';

import { BASEURL } from '..';
import { JobStatus } from '../../declarations';

class Job {
	readonly song: SongDetailed;
	private status: JobStatus = 'Queued';
	private update: (id: string) => void;

	constructor(song: SongDetailed, update: (id: string) => void) {
		this.song = song;
		this.update = update;

		this.main();
	}

	async main() {
		this.setStatus('Queued');
		const download = await this.requestDownload();
		if (!download) {
			this.setStatus('Errored');
			return;
		}

		this.setStatus('Downloaded');
		const audio = await this.downloadAudio();

		if (!audio) {
			this.setStatus('Errored');
			return;
		}
		this.setStatus('Done');
	}

	private requestDownload() {
		return new Promise<boolean>(resolve => {
			const eventSource = new EventSource(BASEURL + '/download?id=' + this.song.videoId);

			eventSource.onmessage = event => {
				const data = JSON.parse(event.data);

				if (data?.status === 'Started') {
					this.setStatus('Downloading');
				} else if (data?.status === 'Done') {
					eventSource.close();
					resolve(true);
				}
			};

			eventSource.onerror = () => {
				eventSource.close();
				resolve(false);
			};
		});
	}

	async downloadAudio() {
		try {
			const blobUrl = await axios
				.get(BASEURL + '/audio/' + this.song.videoId, { responseType: 'arraybuffer' })
				.then(response => {
					const blob = new Blob([response.data], { type: 'audio/mpeg' });
					return URL.createObjectURL(blob);
				})
				.catch(error => console.error('Erreur :', error));

			if (!blobUrl) return;

			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = this.song.name + '.mp3';

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			URL.revokeObjectURL(blobUrl);
		} catch (err) {
			return false;
		}

		return true;
	}

	private setStatus(status: JobStatus) {
		this.status = status;
		this.update(this.song.videoId);
	}

	retry() {
		if (this.status != 'Errored') return;
		this.main();
	}

	getStatus() {
		return this.status;
	}
}

export default Job;
