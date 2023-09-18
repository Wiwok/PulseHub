const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	downloadTrack: (track) => ipcRenderer.send('download-track', track),
	downloadAlbum: (album) => ipcRenderer.send('download-album', album),
	downloadTrackHandle: (callback) => ipcRenderer.on('download-track-handle', callback),
	downloadAlbumHandle: (callback) => ipcRenderer.on('download-album-handle', callback),
	downloadTrackClearHandle: () => ipcRenderer.removeAllListeners('download-track-handle'),
	downloadAlbumClearHandle: () => ipcRenderer.removeAllListeners('download-album-handle'),

	getTrack: (TrackID) => ipcRenderer.invoke('get-track', TrackID),
	getAlbum: (AlbumID) => ipcRenderer.invoke('get-album', AlbumID),

	isAuth: () => ipcRenderer.invoke('is-auth'),
	reAuth: () => ipcRenderer.invoke('re-auth'),

	searchTrack: (search) => ipcRenderer.invoke('search-track', search),
	searchAlbum: (search) => ipcRenderer.invoke('search-album', search),
	searchArtist: (search) => ipcRenderer.invoke('search-artist', search),


	readTrack: (TrackID) => ipcRenderer.invoke('read-track', TrackID)
});