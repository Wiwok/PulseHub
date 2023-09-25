import { useEffect, useState } from 'react';

import PlayerManager from '../Utils/PlayerManager';
import Track from './Track';

function PlayList({ Player, setContextMenu }: { Player: PlayerManager; setContextMenu: Function }) {
	const [Content, setContent] = useState(new Array<Track>());

	useEffect(() => {
		window.api.getLocalTracks().then(tracks => {
			if (Player.playList != null) {
				const array = new Array<Track>();
				Player.playList.forEach(value => {
					const track = tracks.get(value);
					if (track) array.push(track);
				});
				setContent(array);
			}
		});
	}, [Content]);

	return (
		<div>
			{(() => {
				if (!Content.length) {
					return <div>Empty</div>;
				}
				return Content.map((value, i) => {
					return (
						<Track
							Audio={Player}
							track={value}
							setContextMenu={setContextMenu}
							downloadManager={undefined}
							downloadedTracks={undefined}
							key={i}
						/>
					);
				});
			})()}
		</div>
	);
}

export default PlayList;
