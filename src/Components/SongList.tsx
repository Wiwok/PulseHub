import { SongDetailed } from 'ytmusic-api';

import Job from '../Classes/Job';
import { cleanTime } from '../utils';
import Button from './Button';

function SongList({ song }: { song: SongDetailed }) {
	function download() {
		const job = new Job(song);
		job.download();
	}

	return (
		<div className="SongList">
			<img
				src={song.thumbnails.at(-1)?.url}
				alt="Song cover"
				onError={e => (e.currentTarget.src = '/Assets/Icons/MusicIcon.svg')}
			/>
			<div className="SongTitle">
				<div>{song.name}</div>
				<div>{song.artist.name}</div>
			</div>
			<div>{song.duration ? cleanTime(song.duration) : '??:??'}</div>
			<Button value="Download" onClick={download} />
		</div>
	);
}

export default SongList;
