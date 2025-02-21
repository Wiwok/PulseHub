import axios from 'axios';
import { RefObject, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SongDetailed } from 'ytmusic-api';

import { BASEURL } from '..';
import Player from '../Classes/Player';
import SongList from '../Components/SongList';

function Search({ player, download }: { player: RefObject<Player | null>; download: (song: SongDetailed) => void }) {
	const [Results, setResults] = useState<Array<SongDetailed> | null>([]);
	const [searchParams] = useSearchParams();

	function search(query: string) {
		return new Promise<Array<SongDetailed> | null>(resolve => {
			axios
				.get(BASEURL + '/search?q=' + query)
				.then(res => {
					resolve(res.data);
				})
				.catch(() => {
					resolve(null);
				});
		});
	}

	useEffect(() => {
		const query = searchParams.get('q');
		if (!query || query === '') {
			return setResults([]);
		}

		search(query).then(setResults);
	}, [searchParams]);

	return (
		<div className="Search">
			{Results
				? Results.map((song, i) => (
						<SongList
							isPlaying={
								player.current?.state.status == 'Playing' &&
								player.current?.state.song?.videoId == song.videoId
							}
							pause={() => player.current?.pause()}
							play={() => player.current?.play(song)}
							download={() => download(song)}
							song={song}
							key={i}
						/>
				  ))
				: 'An error occurred'}
		</div>
	);
}

export default Search;
