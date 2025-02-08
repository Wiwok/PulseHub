import fs from 'fs';

function checkFile(trackId: string) {
	return fs.existsSync(trackId);
}

export default checkFile;
