const fs = require('fs');

function savePlayList(playlist) {
	const PATH = './datas/';
	try {
		fs.mkdirSync(PATH + 'playlist/', { recursive: true });
		fs.writeFileSync(PATH + 'playlist/' + playlist.id + '.json', JSON.stringify(playlist));
		return true;
	} catch (error) {
		return false;
	}
}

export { savePlayList };
