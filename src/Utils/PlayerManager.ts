import Player from '../Player';

class PlayerManager {
	playList: Array<string> | null;
	player: Player;
	private actualPlaying: number | null;
	private handlers: Map<PlayerManagerEvent, Function>;
	constructor() {
		this.actualPlaying = null;
		this.playList = null;
		this.player = new Player();
		this.handlers = new Map();

		this.player.on('Ended', () => this.nextTrack.bind(this)(true));
	}

	on(Event: PlayerManagerEvent, handler: Function) {
		this.handlers.set(Event, handler);
	}

	off(Event: PlayerManagerEvent) {
		this.handlers.delete(Event);
	}

	load(track: Track) {
		window.api.readTrack(track.id).then(Track => {
			if (!(Track instanceof Error)) {
				this.player.load(Track.Buffer, track);
				this.playList = [track.id];
				this.actualPlaying = 0;
			}
		});
	}

	play(index = this.actualPlaying ?? 0) {
		return new Promise(resolve => {
			if (this.playList != null) {
				window.api.readTrack(this.playList[index]).then(Track => {
					if (!(Track instanceof Error)) {
						this.player.load(Track.Buffer, Track.Track).then(() => resolve(true));
					} else {
						resolve(false);
					}
				});
			}
		});
	}

	previewTrack() {
		if (this.playList != null && this.actualPlaying != null) {
			if (this.player.AudioElement.currentTime < 5) {
				if (this.actualPlaying != 0) {
					this.actualPlaying--;
					this.play().then(success => {
						if (!success) this.nextTrack();
					});
				}
			} else {
				this.play().then(success => {
					if (!success) this.nextTrack();
				});
			}
		}
	}

	nextTrack(automated?: boolean) {
		if (this.playList != null && this.actualPlaying != null) {
			if (this.actualPlaying == this.playList.length - 1) {
				if (automated) {
					const handler = this.handlers.get('Ended');
					if (handler) handler();
					this.actualPlaying = null;
					this.playList = null;
				}
			} else {
				this.actualPlaying++;
				this.play().then(success => {
					if (!success) this.nextTrack();
				});
			}
		}
	}

	/**
	 * @param {string} trackid must be a download track
	 */
	addTrack(trackid: string) {
		if (this.playList == null) this.playList = [];
		this.playList.push(trackid);
	}

	/**
	 * @param {number} index return track at this index
	 */
	removeTrack(index: number) {
		if (index == this.actualPlaying) this.nextTrack();
		if (this.playList == null) this.playList = [];
		this.playList.splice(index);
	}

	/**
	 * @returns  {Array<string>} new playlist
	 */
	shuffle() {
		if (this.playList == null) return [];

		let currentIndex: number = this.playList.length;
		let randomIndex: number;
		while (currentIndex > 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[this.playList[currentIndex], this.playList[randomIndex]] = [
				this.playList[randomIndex],
				this.playList[currentIndex]
			];
		}
		return this.playList;
	}
}

export default PlayerManager;
