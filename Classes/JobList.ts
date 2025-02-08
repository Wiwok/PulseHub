import { EventEmitter } from 'stream';

import { JobEndStatus } from '../declarations';

class JobList {
	private jobs: Set<string>;
	private events: EventEmitter;

	constructor() {
		this.jobs = new Set();
		this.events = new EventEmitter();
	}

	on(id: string, callback: (status: JobEndStatus) => void) {
		this.events.on(id, callback);
	}

	off(id: string, callback: (status: JobEndStatus) => void) {
		this.events.off(id, callback);
	}

	add(id: string) {
		this.jobs.add(id);
	}

	delete(id: string, status: JobEndStatus) {
		this.jobs.delete(id);
		this.events.emit(id, status);
	}

	has(id: string) {
		return this.jobs.has(id);
	}
}

export default JobList;
