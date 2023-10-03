import PlayListObj from './PlayListObj';

class PlaylistManager {
	playLists: Array<PlayListObj>;
	constructor(playLists: Array<PlayListObj> = []) {
		this.playLists = playLists;
	}

	searchById(id: string): PlayListObj | undefined {
		return this.playLists.find(el => el.id == id);
	}

	searchByName(name: string): PlayListObj | undefined {
		return this.playLists.find(el => el.name == name);
	}

	listName(): Array<string>{
		return this.playLists.map((el)=>el.name);
	}
}
