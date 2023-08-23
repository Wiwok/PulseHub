const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

const { initIpc } = require('./backend/data');

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		show: false,
		webPreferences: {
			preload: isDev
				? path.join(app.getAppPath(), './public/preload.js')
				: path.join(app.getAppPath(), './build/preload.js'),
			contextIsolation: true
		}
	});

	win.maximize();
	win.show();

	win.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`
	);

	initIpc(win);
}

app.setPath(
	'userData',
	isDev
		? path.join(app.getAppPath(), 'userdata/')
		: path.join(process.resourcesPath, 'userdata/')
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

process.on('uncaughtException', error => {
	console.log(`Exception: ${error}`);
});