import { useEffect, useState } from 'react';

import Track from './Track';

import DownloadManager from '../Utils/DownloadManager';
import PlayerManager from '../Utils/PlayerManager';

function SearchPage({
	search,
	Audio,
	downloadManager,
	setContextMenu
}: {
	search: string;
	Audio: PlayerManager;
	downloadManager: DownloadManager;
	setContextMenu: Function;
}) {
	const [Content, setContent] = useState(<div className="SearchingMessage">Searching...</div>);
	const [downloadedTracks, setDownloadedTracks] = useState(new Map<string, Track>());

	useEffect(() => {
		window.api.getLocalTracks().then(setDownloadedTracks);
		document.getElementById('input')?.focus();
	}, [setDownloadedTracks]);

	function Action() {
		const value = search;
		if (value == '') {
			setContent(<></>);
			return;
		}
		const input = encodeURIComponent(value);
		window.api.searchTrack(input).then(v => {
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
									setContextMenu={setContextMenu}
									key={i}
									onClick={() => {
										Audio.load(track);
									}}
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

	return { Content };
}

export default SearchPage;
