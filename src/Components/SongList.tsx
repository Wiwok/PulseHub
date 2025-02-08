import { SongDetailed } from 'ytmusic-api';

function Song({ song }: { song: SongDetailed }) {
	return <div className="Song">{song.name}</div>;
}

function SongList({ songs }: { songs: Array<SongDetailed> }) {
	return (
		<div className="SongList">
			{songs.map(song => (
				<Song song={song} />
			))}
		</div>
	);
}

export default SongList;
