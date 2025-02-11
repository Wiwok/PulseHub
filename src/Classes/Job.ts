import { SongDetailed } from 'ytmusic-api';

import { BASEURL } from '..';
import { JobStatus } from '../../declarations';

class Job {
	readonly song: SongDetailed;
	private changeCallback?: (status: JobStatus) => void;
	private status: JobStatus = 'Queued';
	constructor(song: SongDetailed) {
		this.song = song;
	}

	private startDownload() {
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

	async download() {
		this.setStatus('Requested');
		const song = await this.startDownload();
		if (song) {
			this.setStatus('Done');
		} else {
			this.setStatus('Errored');
		}
	}

	onChange(callback: (status: JobStatus) => void) {
		this.changeCallback = callback;
	}

	private setStatus(status: JobStatus) {
		this.status = status;
		if (this.changeCallback) {
			this.changeCallback(status);
		}
	}

	getStatus() {
		return this.status;
	}
}

export default Job;
