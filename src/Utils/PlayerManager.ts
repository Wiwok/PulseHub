import Player from './Player';
import PlayListObj from './PlayListObj';

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

	load(track: Track | string) {
		if (typeof track != 'string') {
			window.api.readTrack(track.id).then(tr => {
				if (!(tr instanceof Error)) {
					this.player.load(tr.Buffer, track);
					this.playList = [track.id];
					this.actualPlaying = 0;
				} else {
					this.player.load(track.id, track);
				}
			});
		} else {
			if (track.length != 11) {
				window.api.getTrack(track).then(onlineTrack => {
					if (onlineTrack) {
						window.api.readTrack(onlineTrack.id).then(Track => {
							if (!(Track instanceof Error)) {
								this.player.load(Track.Buffer, onlineTrack);
								this.playList = [onlineTrack.id];
								this.actualPlaying = 0;
							} else {
								this.player.load(onlineTrack.id, onlineTrack);
							}
						});
					}
				});
			} else {
				this.player.load(track);
			}
		}
	}

	loadPlayList(idList: Array<string>) {
		this.playList = idList;
	}

	loadPlayListObj(playlist: PlayListObj) {
		this.playList = [];
		playlist.tracks.forEach(element => {
			this.playList?.push(element);
		});
	}

	loadTrackPlayList(trackList: Map<string, Track>) {
		this.playList = [];
		trackList.forEach((element, index) => {
			this.playList?.push(index);
		});
	}

	play(index = this.actualPlaying ?? 0) {
		return new Promise(resolve => {
			if (this.playList != null) {
				window.api.readTrack(this.playList[index]).then(Track => {
					if (!(Track instanceof Error)) {
						this.player.load(Track.Buffer, Track.Track).then(() => {
							this.actualPlaying = index;
							resolve(true);
						});
					} else {
						if (this.playList)
							this.player.load(this.playList[index]).then(() => {
								this.actualPlaying = index;
								resolve(true);
							});
					}
				});
			}
		});
	}

	previewTrack() {
		if (this.playList != null && this.actualPlaying != null) {
			this.player.getProgress().then(progress => {
				if (progress < 5) {
					if (this.actualPlaying != null && this.actualPlaying != 0) {
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
			});
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
