import cors from 'cors';
import express from 'express';
import path from 'path';

import router from './backend/router';

const server = express();

server.use(express.json());
server.use(cors());

server.use(express.static(path.join(__dirname, 'build')));

server.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(8080, () => {
	console.log('Ready !');
});

server.use('/api', router);
