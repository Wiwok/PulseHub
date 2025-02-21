import { SongDetailed } from 'ytmusic-api';

import Job from './Job';

class Downloader {
	private downloads = new Map<string, Job>();
	private update: () => void;

	constructor(update: () => void) {
		this.update = update;
	}

	private rerender() {
		this.downloads.forEach(job => {
			if (job.getStatus() == 'Done') {
				this.downloads.delete(job.song.videoId);
			}
		});
		this.update();
	}

	add(song: SongDetailed) {
		if (this.downloads.has(song.videoId)) return;

		this.downloads.set(song.videoId, new Job(song, this.rerender.bind(this)));
	}

	getJobs() {
		return Array.from(this.downloads.values());
	}
}

export default Downloader;
