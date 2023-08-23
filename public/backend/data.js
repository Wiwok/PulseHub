const { ipcMain } = require("electron");
const fs = require('fs');

const { spottylib } = require('./spottylib');

async function initIpc(mainWindow) {
	const sl = new spottylib();

	if (!await sl.auth()) {
		console.log('Spotify authentification failed');
	}

	ipcMain.handle('re-auth', async () => {
		return await sl.auth();
	});

	ipcMain.handle('is-auth', () => {
		if (sl.accessToken != null) {
			return true;
		}
		return false;
	});

	ipcMain.on('download-track', async (e, track, output) => {
		function callback(value) {
			mainWindow.webContents.send('download-track-handle', value)
		}
		sl.downloadTrack(track, output, callback);
	});

	ipcMain.on('download-album', async (e, album, output) => {
		function callback(value) {
			mainWindow.webContents.send('download-album-handle', value)
		}
		sl.downloadAlbum(album, output, callback);
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
			return fs.readFileSync(TrackID + ".mp3");
		}
		catch (err) { return err }
	});
}

module.exports = { initIpc };