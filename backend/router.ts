import { Router } from 'express';

import YT_music_API from './ytapi';

const router = Router();
const yt_api = new YT_music_API();

router.get('/', (req, res) => {
	res.send('API online!');
});

router.get('/search', async (req, res) => {
	const query = req.query.q;
	if (typeof query != 'string') {
		res.status(400).json({ error: "Le paramètre 'q' est requis." });
		return;
	}

	res.json(await yt_api.search(query));
});

router.get('/download', (req, res) => {
	const id = req.query.id;

	if (!id || typeof id != 'string') {
		res.status(400).json({ error: 'Parameter id required' });
		return;
	}

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');

	res.write(`data: {"status": "Started"}\n\n`);

	yt_api
		.downloadTrack(id)
		.then(result => {
			res.write(`data: {"status": "${result}"}\n\n`);
			res.end();
		})
		.catch(err => {
			res.write(`data: {"status": "Errored", "message": "${err.message}"}\n\n`);
			res.end();
		});
});

export default router;
