import { useEffect, useState } from 'react';

import Track from './Track';
import PlayerManager from '../Utils/PlayerManager';

function Library({ Audio, setContextMenu }: { Audio: PlayerManager; setContextMenu: Function }) {
	const [Content, setContent] = useState(<></>);

	useEffect(() => {
		window.api.getLocalTracks().then(value => {
			if (value && value.size) {
				setContent(
					<div className="SearchResults">
						<div className="SearchResultsDescription">
							<div>Title</div>
							<div className="SearchResultsDescriptionAlbum">Album</div>
							<div>Duration</div>
						</div>
						{Array.from(value.values()).map((v, i) => {
							return (
								<Track
									downloadManager={undefined}
									Audio={Audio}
									track={v}
									key={i}
									setContextMenu={setContextMenu}
									onClick={() => {
										Audio.loadTackPlayList(value);
										Audio.play(i);
									}}
									downloadedTracks={undefined}
								/>
							);
						})}
					</div>
				);
			} else {
				setContent(<div className="SearchingMessage">It's sadly empty here...</div>);
			}
		});
	}, [setContent]);

	return <div className="SearchPage">{Content}</div>;
}

export default Library;
