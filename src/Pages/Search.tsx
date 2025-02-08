import axios from 'axios';
import { createRef, useState } from 'react';
import { SongDetailed } from 'ytmusic-api';

import { BASEURL } from '..';
import SongList from '../Components/SongList';

function Search() {
	const [Results, setResults] = useState<Array<SongDetailed>>([]);
	const input = createRef<HTMLInputElement>();

	function search(query: string) {
		return new Promise<Array<SongDetailed> | undefined>(resolve => {
			axios
				.get(BASEURL + 'search?q=' + query)
				.then(res => {
					resolve(res.data);
				})
				.catch(() => {
					resolve(undefined);
				});
		});
	}

	function click() {
		const query = input.current?.value as string;
		search(query).then(res => {
			if (res) {
				setResults(res);
			}
		});
	}

	return (
		<div className="Search">
			<input ref={input} />
			<button onClick={click} />
			<SongList songs={Results} />
		</div>
	);
}

export default Search;
