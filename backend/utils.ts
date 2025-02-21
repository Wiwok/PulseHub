import fs from 'fs';
import path from 'path';

import { VIDEO_DIR } from '..';

function checkFile(trackId: string) {
	return fs.existsSync(path.join(__dirname, '..', 'output', trackId + '.mp3'));
}

function cleanDir() {
	fs.rmSync(VIDEO_DIR, { recursive: true });
	fs.mkdirSync(VIDEO_DIR);
}

export { checkFile, cleanDir };
