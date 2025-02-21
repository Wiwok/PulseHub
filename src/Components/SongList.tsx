import { SongDetailed } from 'ytmusic-api';

import PauseIcon from '../Assets/PauseIcon';
import PlayIcon from '../Assets/PlayIcon';
import { cleanTime } from '../utils';
import Button from './Button';

function SongList({
	song,
	download,
	play,
	pause,
	isPlaying
}: {
	song: SongDetailed;
	download: () => void;
	play: () => void;
	pause: () => void;
	isPlaying: boolean;
}) {
	return (
		<div className="SongList" onDoubleClick={play}>
			<div className="SongImage" onClick={isPlaying ? pause : play}>
				<img
					src={song.thumbnails.at(-1)?.url}
					alt="Song cover"
					onError={e => (e.currentTarget.src = '/Assets/Icons/MusicIcon.svg')}
				/>
				{isPlaying ? <PauseIcon /> : <PlayIcon />}
			</div>
			<div className="SongLabel">
				<div>{song.name}</div>
				<div>{song.artist.name}</div>
			</div>
			<div>{song.duration ? cleanTime(song.duration) : '??:??'}</div>
			<Button value="Download" onClick={download} />
		</div>
	);
}

export default SongList;
