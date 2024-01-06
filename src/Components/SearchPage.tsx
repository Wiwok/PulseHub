import { useEffect, useState } from 'react';
import Track from './Track';
import PlayerManager from '../Utils/PlayerManager';
import DownloadManager from '../Utils/DownloadManager';

function SearchPage({
	Audio,
	downloadManager,
	setContextMenu
}: {
	Audio: PlayerManager;
	downloadManager: DownloadManager;
	setContextMenu: Function;
}) {
	const [Content, setContent] = useState(<></>);
	const [downloadedTracks, setDownloadedTracks] = useState(new Map<string, Track>());

	function Action() {
		const value = (document.getElementById('searchInput') as HTMLInputElement).value;
		if (value == '') {
			setContent(<></>);
			return;
		}
		const searchInput = encodeURIComponent(value);
		window.api.searchTrack(searchInput).then(v => {
			if (typeof v == 'undefined') {
				setContent(<div className="SearchingMessage">An error occurred</div>);
			} else if (v && v.length) {
				setContent(
					<div className="SearchResults">
						<div className="serchText">
							You are search <div className="searchTerm">{value}</div>:
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

	function searchInput() {
		const oldValue = (document.getElementById('searchInput') as HTMLInputElement).value;
		setTimeout(() => {
			const value = (document.getElementById('searchInput') as HTMLInputElement).value;
			if (oldValue == value) {
				Action();
			}
		}, 500);
	}

	useEffect(() => {
		document.getElementById('searchInput')?.addEventListener('input', searchInput);
		window.api.getLocalTracks().then(setDownloadedTracks);
	}, [setDownloadedTracks]);

	return <div className="searchPage scrollbar-hidden">{Content}</div>;
}

export default SearchPage;
