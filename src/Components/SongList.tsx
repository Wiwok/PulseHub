import { SongDetailed } from 'ytmusic-api';

import { cleanTime } from '../utils';

function SongList({ song }: { song: SongDetailed }) {
	return (
		<div className="SongList">
			<img src={song.thumbnails.at(-1)?.url} />
			<div>{song.name}</div>
			<div>{song.artist.name}</div>
			<div>{song.duration ? cleanTime(song.duration) : '??:??'}</div>
		</div>
	);
}

export default SongList;
