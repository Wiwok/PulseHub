import { useEffect, useState } from 'react';

import Track from './Track';
import PlayerManager from '../Utils/PlayerManager';

function SongsList({ Audio, setContextMenu }: { Audio: PlayerManager; setContextMenu: Function }) {
	const [Content, setContent] = useState(<></>);

	useEffect(() => {
		window.api.getLocalTracks().then(value => {
			if (value && value.size) {
				setContent(
					<div className="SongList">
						<div className="SongListResults">
							<div className="SongListText">
								Your <div className="SongListColored">songs</div>:
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
											Audio.loadTrackPlayList(value);
											Audio.play(i);
										}}
										downloadedTracks={undefined}
									/>
								);
							})}
						</div>
					</div>
				);
			} else {
				setContent(<div className="SearchingMessage">It's sadly empty here...</div>);
			}
		});
	}, [setContent]);

	return <div className="DefaultPage">{Content}</div>;
}

export default SongsList;
