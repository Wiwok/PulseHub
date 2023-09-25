class Player {
	private AudioElement: HTMLAudioElement;
	private online: boolean;
	YTPlayerRef: any;
	status: PlayerStatus;
	track: Track | null;

	private loadedCallback: Function[];
	private playCallback: Function[];
	private pauseCallback: Function[];
	private endedCallback: Function[];

	constructor() {
		this.track = null;
		this.AudioElement = new Audio();
		this.status = 'Idle';
		this.YTPlayerRef = null;
		this.online = false;
		this.loadedCallback = [];
		this.endedCallback = [];
		this.playCallback = [];
		this.pauseCallback = [];

		this.AudioElement.addEventListener('loadeddata', () => this.TriggerEvent('Loaded'));
		this.AudioElement.addEventListener('ended', () => this.TriggerEvent('Ended'));
		this.AudioElement.addEventListener('pause', () => this.TriggerEvent('Paused'));
		this.AudioElement.addEventListener('play', () => this.TriggerEvent('Playing'));
	}

	private setStatus(status: PlayerStatus) {
		this.status = status;
		if (status == 'Playing') {
			this.TriggerEvent('Playing');
		} else if (status == 'Paused') {
			this.TriggerEvent('Paused');
		} else if (status == 'Loaded') {
			this.TriggerEvent('Loaded');
		} else if (status == 'Idle') {
			this.TriggerEvent('Ended');
		}
	}

	private DeconstructSong() {
		this.AudioElement.src = '';
		this.AudioElement.load();
		this.setStatus('Idle');
	}

	load(source: string | Buffer, track: Track) {
		return new Promise<void>(resolve => {
			if (this.status == 'Playing') {
				this.pause();
				this.DeconstructSong();
			}

			this.track = track;

			if (typeof source != 'string') {
				this.online = false;
				this.AudioElement.addEventListener('loadeddata', () => {
					this.setStatus('Loaded');
					this.play();
					resolve();
				});
				this.AudioElement.addEventListener('ended', this.DeconstructSong);
				const blob = new Blob([source], { type: 'audio/mp3' });
				const url = window.URL.createObjectURL(blob);
				this.AudioElement.src = url;
				this.AudioElement.addEventListener('ended', () => {
					window.URL.revokeObjectURL(url);
				});
				this.AudioElement.load();
			} else {
				this.online = true;
				window.api.getYoutubeID(track).then(YTTrackID => {
					this.YTPlayerRef.current.src =
						'http://www.youtube-nocookie.com/embed/' + YTTrackID + '?autoplay=1&amp;enablejsapi=1';
					this.setStatus('Loaded');
					this.setStatus('Playing');
					resolve();
				});
			}
		});
	}

	play() {
		return new Promise<Boolean>(resolve => {
			if (this.status == 'Loaded' || this.status == 'Paused') {
				if (this.online) {
					this.YTPlayerRef.current.contentWindow.postMessage(
						'{"event":"command","func":"playVideo","args":""}',
						'*'
					);
					this.setStatus('Playing');
					resolve(true);
				} else {
					this.AudioElement.play().then(() => {
						this.setStatus('Playing');
						resolve(true);
					});
				}
			} else {
				resolve(false);
			}
		});
	}

	getProgress() {
		return this.AudioElement.currentTime;
	}

	setProgress(value: number) {
		this.AudioElement.currentTime = value;
	}

	getDuration() {
		return this.AudioElement.duration;
	}

	pause() {
		if (this.status != 'Playing') return false;
		this.setStatus('Paused');
		if (this.online) {
			this.YTPlayerRef.current.contentWindow.postMessage(
				'{"event":"command","func":"pauseVideo","args":""}',
				'*'
			);
		} else {
			this.AudioElement.pause();
		}
		return true;
	}

	togglePlay() {
		return new Promise<Boolean>(resolve => {
			if (this.status != 'Paused') {
				resolve(this.pause());
			} else {
				this.play().then(resolve);
			}
		});
	}

	on(Event: PlayerEvents, callback: () => void) {
		if (Event == 'Loaded') {
			this.loadedCallback.push(callback);
		} else if (Event == 'Ended') {
			this.endedCallback.push(callback);
		} else if (Event == 'Paused') {
			this.pauseCallback.push(callback);
		} else if (Event == 'Playing') {
			this.playCallback.push(callback);
		}
	}

	private TriggerEvent(Event: PlayerEvents) {
		if (Event == 'Playing') {
			this.playCallback.forEach(v => v());
		} else if (Event == 'Paused') {
			this.pauseCallback.forEach(v => v());
		} else if (Event == 'Loaded') {
			this.loadedCallback.forEach(v => v());
		} else if (Event == 'Ended') {
			this.endedCallback.forEach(v => v());
		}
	}
}

export default Player;
