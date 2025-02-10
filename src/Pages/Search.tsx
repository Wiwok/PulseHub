import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SongDetailed } from 'ytmusic-api';

import { BASEURL } from '..';
import SongList from '../Components/SongList';

function Search() {
	const [Results, setResults] = useState<Array<SongDetailed>>([]);
	const [searchParams] = useSearchParams();

	function search(query: string) {
		return new Promise<Array<SongDetailed> | undefined>(resolve => {
			axios
				.get(BASEURL + '/search?q=' + query)
				.then(res => {
					resolve(res.data);
				})
				.catch(() => {
					resolve(undefined);
				});
		});
	}

	useEffect(() => {
		const query = searchParams.get('q');
		if (!query || query === '') {
			return setResults([]);
		}

		search(query).then(res => {
			if (res) {
				setResults(res);
			}
		});
	}, [searchParams]);

	return (
		<div className="Search">
			{Results.map((song, i) => (
				<SongList song={song} key={i} />
			))}
		</div>
	);
}

export default Search;
