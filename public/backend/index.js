const { ipcMain } = require("electron");
const fs = require('fs');

const { spottylib } = require('./spottylib');

const PATH = './datas/';
fs.mkdirSync(PATH, { recursive: true });
fs.mkdirSync(PATH + 'tracks', { recursive: true });
if (!fs.existsSync(PATH + 'tracks.json')) {
	fs.writeFileSync(PATH + 'tracks.json', JSON.stringify([]));
}

async function initIpc(mainWindow) {
	const sl = new spottylib();

	if (!await sl.auth()) {
		console.log('Spotify authentification failed');
	}

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
		return new Promise(resolve => {
			sl.getTrack(TrackID).then(resolve);
		});
	});

	ipcMain.handle('get-album', (e, AlbumID) => {
		return new Promise(resolve => {
			sl.getAlbum(AlbumID).then(resolve);
		});
	});

	ipcMain.handle('search-track', (e, search) => {
		return new Promise(resolve => {
			sl.searchTrack(search).then(resolve);
		});
	});

	ipcMain.handle('search-album', (e, search) => {
		return new Promise(resolve => {
			sl.searchAlbum(search).then(resolve);
		});
	});

	ipcMain.handle('search-artist', (e, search) => {
		return new Promise(resolve => {
			sl.searchArtist(search).then(resolve);
		});
	});

	ipcMain.handle('read-track', (e, TrackID) => {
		try {
			return fs.readFileSync(PATH + 'tracks/' + TrackID + ".mp3");
		}
		catch (err) { return err }
	});

	ipcMain.handle('get-local-tracks', () => {
		return JSON.parse(fs.readFileSync(PATH + 'tracks.json'));
	});

	ipcMain.handle('remove-track', (TrackID) => {
		return new Promise(resolve => {
			sl.removeTrack(TrackID);
			resolve();
		})
	});
}

module.exports = { initIpc };