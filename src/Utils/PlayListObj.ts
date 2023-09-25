class PlayListObj {
	name: string;
	id: string;
	tracks: string[];
	constructor(id: string, name: string, tracks: string[] = []) {
		this.id = id;
		this.name = name;
		this.tracks = tracks;
	}

	addTrack(id: string, at: number = -1) {
		if (at > this.tracks.length - 1 || at < 0) at = this.tracks.length - 1;
		this.tracks.splice(at, 0, id);
	}

	removeTrackById(id: string) {
		this.tracks = this.tracks.filter(el => el != id);
	}

	removeTrackAt(index: number) {
		this.tracks.splice(index);
	}
}
export default PlayListObj;
