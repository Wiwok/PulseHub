const { ipcMain } = require('electron');
const fs = require('fs');

const { spottylib, getYoutubeID } = require('./spottylib');

const PATH = './datas/';
fs.mkdirSync(PATH, { recursive: true });
fs.mkdirSync(PATH + 'tracks', { recursive: true });
fs.mkdirSync(PATH + 'images/x1/', { recursive: true });
fs.mkdirSync(PATH + 'images/x2/', { recursive: true });
fs.mkdirSync(PATH + 'images/x3/', { recursive: true });
if (!fs.existsSync(PATH + 'tracks.json')) {
	fs.writeFileSync(PATH + 'tracks.json', JSON.stringify(new Map()));
}

async function initIpc(mainWindow) {
	const sl = new spottylib();

	ipcMain.handle('re-auth', async () => {
		return await sl.auth();
	});

	ipcMain.handle('is-auth', () => {
		return sl.accessToken != null;
	});

	ipcMain.on('download-track', async (e, track) => {
		function callback(value) {
			mainWindow.webContents.send('download-track-handle', value);
		}
		sl.downloadTrack(track, callback);
	});

	ipcMain.on('download-album', async (e, album) => {
		function callback(value) {
			mainWindow.webContents.send('download-album-handle', value);
		}
		sl.downloadAlbum(album, callback);
	});

	ipcMain.handle('get-track', (e, TrackID) => {
		return new Promise(res => {
			sl.getTrack(TrackID).then(res);
		});
	});

	ipcMain.handle('get-album', (e, AlbumID) => {
		return new Promise(res => {
			sl.getAlbum(AlbumID).then(res);
		});
	});

	ipcMain.handle('search-track', (e, search) => {
		return new Promise(res => {
			sl.searchTrack(search).then(res);
		});
	});

	ipcMain.handle('search-album', (e, search) => {
		return new Promise(res => {
			sl.searchAlbum(search).then(res);
		});
	});

	ipcMain.handle('search-artist', (e, search) => {
		return new Promise(res => {
			sl.searchArtist(search).then(res);
		});
	});

	ipcMain.handle('read-track', (e, TrackID) => {
		try {
			const tracks = new Map(JSON.parse(fs.readFileSync(PATH + 'tracks.json')));
			const buffer = fs.readFileSync(PATH + 'tracks/' + TrackID + '.mp3');
			const track = tracks.get(TrackID);
			return { Buffer: buffer, Track: track };
		} catch (err) {
			return err;
		}
	});

	ipcMain.handle('get-local-tracks', () => {
		try {
			return new Map(JSON.parse(fs.readFileSync(PATH + 'tracks.json')));
		} catch (err) {
			console.error('Unable to read local tracks: ' + err);
			return new Map();
		}
	});

	ipcMain.handle('remove-track', (e, TrackID) => {
		return new Promise(res => {
			sl.removeTrack(TrackID);
			res();
		});
	});

	ipcMain.handle('get-youtube-id', (e, Track) => {
		return getYoutubeID(Track);
	});

	if (!(await sl.auth())) {
		console.error('Spotify authentification failed');
	}
}

module.exports = { initIpc };
