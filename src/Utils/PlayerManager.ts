import Player from "../Player";

class PlayerManager {
	playList: Array<string>
	player: Player;
	private actualPlaying: number | undefined;
	private handlers: Map<PlayerManagerEvent, Function>;
	constructor() {
		this.actualPlaying = undefined;
		this.playList = [];
		this.player = new Player();
		this.handlers = new Map();

		this.player.on('Ended', this.nextTrack);
	}

	on(Event: PlayerManagerEvent, handler: Function) {
		this.handlers.set(Event, handler);
	}

	off(Event: PlayerManagerEvent) {
		this.handlers.delete(Event);
	}

	play() {
		window.api.readTrack(this.playList[this.actualPlaying]).then(Buffer => {
			if (!(Buffer instanceof Error)) {
				this.player.load(Buffer, this.playList[(this.actualPlaying) as number]);
			} else {
				this.nextTrack();
			}
		});
	}

	previewTrack() {
		if (!this.actualPlaying || typeof this.actualPlaying == undefined) this.actualPlaying = 1;
		if (!this.playList.length) return;
		if ((this.actualPlaying == this.playList.length) && (typeof this.handlers.get('Ended') != undefined)) {
			(this.handlers.get('Ended') as Function)();
		}
		this.actualPlaying--;
		this.play();
	}

	nextTrack() {
		if (!this.actualPlaying) this.actualPlaying = -1;
		if (!this.playList.length) return;
		if ((this.actualPlaying == this.playList.length) && (typeof this.handlers.get('Ended') != undefined)) {
			(this.handlers.get('Ended') as Function)();
		}
		this.actualPlaying++;
		this.play();
	}

	/**
	 * @param {string} trackid must be a download track
	 * @returns {Array<string>} new playlist
	 */
	addTrack(trackid: string): Array<string> {
		if (!this.TrackMap.has(trackid)) return this.playList;

		this.playList.push(trackid);
		return this.playList;
	}

	/**
	 * @param {number} index return track at this index
	 * @returns {Array<string>} new playlist 
	 */
	removeTrak(index: number): Array<string> {
		if (index == this.actualPlaying) this.nextTrack();
		this.playList.splice(index);
		return this.playList;
	}

	/**
	 * @returns  {Array<string>} new playlist
	 */
	shuffle(): Array<string> {
		if (!this.playList.length) return [];

		let currentIndex: number = this.playList.length;
		let randomIndex: number;
		while (currentIndex > 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[this.playList[currentIndex], this.playList[randomIndex]] = [this.playList[randomIndex], this.playList[currentIndex]];
		}
		return this.playList;
	}
}

export default PlayerManager;