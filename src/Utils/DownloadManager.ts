class DownloadManager {
	private handlers = new Array<DownloadHandler>();
	private onceHandlers = new Array<DownloadHandler>();

	constructor() {
		window.api.downloadTrackClearHandle();
		window.api.downloadTrackHandle((ev, value) => this.catchDownload.bind(this, ev, value)());
	}

	private catchDownload(ev: any, value: { id: string; status: DownloadStatus }) {
		this.handlers.forEach(v => {
			if (v.id == value.id && value.status == v.event) {
				v.callback();
			}
		});
		this.onceHandlers.forEach((v, i) => {
			if (v.id == value.id) {
				if (value.status == v.event) {
					v.callback();
					this.handlers.splice(i, 1);
				}
			}
		});
	}

	on(event: DownloadStatus, id: string, callback: Function) {
		this.handlers.push({ event, id, callback });
	}

	once(event: DownloadStatus, id: string, callback: Function) {
		this.onceHandlers.push({ event, id, callback });
	}

	off(id: string) {
		this.handlers = this.handlers.filter(value => {
			if (value.id != id) {
				return value;
			}
		});
	}
}

export default DownloadManager;