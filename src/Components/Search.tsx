import { useEffect, useState } from 'react';

import Track from './Track';

import SearchImg from '../Assets/Search.png';

function Search({ Audio, downloadManager }) {
	const [Content, setContent] = useState(<></>);
	const [downloadedTracks, setDownloadedTracks] = useState(new Map<string, Track>());

	useEffect(() => {
		window.api.getLocalTracks().then(setDownloadedTracks);
		document.getElementById('input')?.focus();
	}, [setDownloadedTracks]);

	function Action() {
		const value = (document.getElementById('input') as HTMLInputElement).value;
		if (value == '') {
			setContent(<></>);
			return;
		}
		const input = encodeURIComponent(value);
		window.api.searchTrack(input).then((v) => {
			if (typeof v == 'undefined') {
				setContent(<div className="SearchingMessage">An error occurred</div>);
			} else if (v && v.length) {
				setContent(
					<div className="SearchResults">
						<div className="SearchResultsDescription">
							<div>Title</div>
							<div className="SearchResultsDescriptionAlbum">Album</div>
							<div>Duration</div>
						</div>
						{v.map((track, i) => {
							return (
								<Track
									downloadManager={downloadManager}
									Audio={Audio}
									track={track}
									key={i}
									downloadedTracks={downloadedTracks}
								/>
							);
						})}
					</div>
				);
			} else {
				setContent(<div className="SearchingMessage">No result</div>);
			}
		});
	}

	function input() {
		const oldValue = (document.getElementById('input') as HTMLInputElement).value;
		setTimeout(() => {
			const value = (document.getElementById('input') as HTMLInputElement).value;
			if (oldValue == value) {
				Action();
			}
		}, 500);
	}

	return (
		<div className="SearchPage">
			<div className="searchBox">
				<input
					className="searchInput"
					onInput={input}
					onKeyUp={(ev) => {
						if (ev.key == 'Enter') {
							setContent(<div className="SearchingMessage">Searching...</div>);
							Action();
						}
					}}
					id="input"
					placeholder="Search"
				></input>
				<img src={SearchImg} onClick={Action} alt="Search" className="searchButton"></img>
			</div>
			{Content}
		</div>
	);
}

export default Search;
