import { useEffect, useState } from "react";

import Player from "../Player";
import Track from "./Track";

function Library({ Audio }: { Audio: Player }) {
	const [Content, setContent] = useState(<></>);

	useEffect(() => {
		window.api.getLocalTracks().then((value) => {
			if (value && value.size) {
				setContent(
					<div className="SearchResults">
						<div className="SearchResultsDescription">
							<div>Title</div>
							<div className="SearchResultsDescriptionAlbum">Album</div>
							<div>Duration</div>
						</div>
						{
							Array.from(value.values()).map((valeur, i) => {
								console.log(valeur);
								return (
									<Track downloadManager={undefined} Audio={Audio} track={valeur} key={i} downloadedTracks={undefined} />
								);
							})
						}
						{/* {value.map((track, i) => {
							return (<Track downloadManager={undefined} Audio={Audio} track={track} key={i} downloadedTracks={undefined} />)
						})} */}
					</div>
				);
			} else {
				setContent(
					<div className="SearchPage">
						<div className="SearchingMessage">It's sadly empty here...</div>
					</div>
				);
			}
		})
	}, [setContent]);

	return (
		<div>
			{Content}
		</div>
	);
}

export default Library;