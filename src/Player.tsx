class Player {
	song: string | null;
	track: Track | null;
	AudioElement: HTMLAudioElement;
	status: PlayerStatus;
	constructor() {
		this.song = null;
		this.track = null;
		this.AudioElement = new Audio();
		this.status = 'Idle';
	}

	load(source: string | Buffer, track?: Track) {
		function DeconstructSong(el: Player) {
			el.AudioElement.src = '';
			el.AudioElement.load();
			el.status = 'Idle';
			el.song = null;
		}

		return new Promise<void>((resolve) => {
			if (this.status == 'Playing') {
				this.pause();
				DeconstructSong(this);
			}
			if (track) {
				this.track = track;
			}
			this.AudioElement.addEventListener('loadeddata', () => {
				this.status = 'Loaded';
				this.play();
				resolve();
			});
			this.AudioElement.addEventListener('ended', () => DeconstructSong(this));

			if (typeof source == 'object') {
				const blob = new Blob([source], { type: 'audio/mp3' });
				const url = window.URL.createObjectURL(blob);
				this.AudioElement.src = url;
				this.song = url;
				this.AudioElement.addEventListener('ended', () => {
					window.URL.revokeObjectURL(url);
				});
			} else {
				this.song = source;
				this.AudioElement.src = source;
			}
			this.AudioElement.load();
		});
	}

	play() {
		return new Promise<Boolean>((resolve) => {
			if (this.status == 'Loaded' || this.status == 'Paused') {
				this.AudioElement.play().then(() => {
					this.status = 'Playing';
					resolve(true);
				});
			} else {
				resolve(false);
			}
		});
	}

	pause() {
		if (this.status == 'Playing') {
			this.status = 'Paused';
			this.AudioElement.pause();
			return true;
		}
		return false;
	}

	togglePlay() {
		return new Promise<Boolean>((resolve) => {
			if (this.status == 'Paused') {
				this.play().then(resolve);
			} else {
				resolve(this.pause());
			}
		});
	}

	on(Event: PlayerEvents, callback: () => void) {
		if (Event == 'Loaded') {
			this.AudioElement.addEventListener('loadeddata', callback);
		} else if (Event == 'Ended') {
			this.AudioElement.addEventListener('ended', callback);
		} else if (Event == 'Paused') {
			this.AudioElement.addEventListener('pause', callback);
		} else if (Event == 'Playing') {
			this.AudioElement.addEventListener('play', callback);
		}
	}
}

export default Player;
