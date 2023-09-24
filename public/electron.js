const path = require('path');

const { app, BrowserWindow } = require('electron');

const { initIpc } = require('./backend/index');

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		show: false,
		icon: __dirname + '/favicon.ico',
		webPreferences: {
			preload: app.isPackaged
				? path.join(app.getAppPath(), './build/preload.js')
				: path.join(app.getAppPath(), './public/preload.js'),
			contextIsolation: true
		}
	});

	win.maximize();
	win.show();

	initIpc(win);
	win.loadURL(app.isPackaged ? `file://${path.join(__dirname, '../build/index.html')}` : 'http://localhost:3000');
}

app.setPath(
	'userData',
	app.isPackaged ? path.join(process.resourcesPath, 'user/') : path.join(app.getAppPath(), 'user/')
);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

process.on('uncaughtException', (error) => {
	console.error(`Exception: ${error}`);
});
