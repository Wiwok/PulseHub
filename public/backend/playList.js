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

function getPlayList(id) {
	const PATH = './datas/';
	try {
		return JSON.parse(fs.readFileSync(PATH + 'playlist/' + playlist.id + '.json'));
	} catch (error) {
		return undefined;
	}
}

module.exports = { savePlayList, getPlayList };
