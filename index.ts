import cors from 'cors';
import express from 'express';
import path from 'path';

import router from './backend/router';
import { cleanDir } from './backend/utils';

const PORT = 8080;
const VIDEO_DIR = path.join(__dirname, '/output');
cleanDir();

const server = express();

server.use(express.json());
server.use(cors());

server.use(express.static(path.join(__dirname, 'build')));

server.listen(PORT, () => {
	console.log('Service ready on port ' + PORT + ' !');
});

server.use('/api', router);

server.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export { VIDEO_DIR };
