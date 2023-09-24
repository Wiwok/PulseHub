class DownloadManager {
	private handlers = new Map<string, DownloadHandler>();
	private onceHandlers = new Map<string, DownloadHandler>();

	constructor() {
		window.api.downloadTrackClearHandle();
		window.api.downloadTrackHandle((ev, value) => this.catchDownload.bind(this, ev, value)());
	}

	private catchDownload(ev: any, value: { id: string; status: DownloadStatus }) {
		this.handlers.get(value.id + value.status)?.callback();
		this.handlers.get('*' + value.status)?.callback();
		this.onceHandlers.get(value.id + value.status)?.callback();
		this.onceHandlers.delete(value.id + value.status);
		this.onceHandlers.get('*' + value.status)?.callback();
		this.onceHandlers.delete('*' + value.status);
	}

	on(event: DownloadStatus, id: string, callback: Function) {
		this.handlers.set(id + event, { event, callback });
	}

	once(event: DownloadStatus, id: string, callback: Function) {
		this.onceHandlers.set(id + event, { event, callback });
	}

	off(id: string) {
		this.handlers.delete(id);
	}
}

export default DownloadManager;
