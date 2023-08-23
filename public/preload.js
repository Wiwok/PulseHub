const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	downloadTrack: (track, output) => ipcRenderer.send('download-track', track, output),
	downloadAlbum: (album, output) => ipcRenderer.send('download-album', album, output),
	downloadTrackHandle: (callback) => ipcRenderer.on('download-track-handle', callback),
	downloadAlbumHandle: (callback) => ipcRenderer.on('download-album-handle', callback),
	downloadTrackRemoveHandle: (callback) => ipcRenderer.removeListener('download-track-handle', callback),
	downloadAlbumRemoveHandle: (callback) => ipcRenderer.removeListener('download-album-handle', callback),

	getTrack: (TrackID) => ipcRenderer.invoke('get-track', TrackID),
	getAlbum: (AlbumID) => ipcRenderer.invoke('get-album', AlbumID),

	isAuth: () => ipcRenderer.invoke('is-auth'),
	reAuth: () => ipcRenderer.invoke('re-auth'),

	searchTrack: (search) => ipcRenderer.invoke('search-track', search),
	searchAlbum: (search) => ipcRenderer.invoke('search-album', search),
	searchArtist: (search) => ipcRenderer.invoke('search-artist', search)
});