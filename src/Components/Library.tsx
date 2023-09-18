import { useEffect, useState } from "react";
import Player from "../Player";
import Track from "./Track";

function Library({ Audio }: { Audio: Player }) {
	const tracks = window.api.getLocalTracks();
	const [Content, setContent] = useState(<></>);

	useEffect(() => {
		tracks.then((value) => {
			setContent(
				<div className="SearchResults">
					<div className="SearchResultsDescription">
						<div>Title</div>
						<div className="SearchResultsDescriptionAlbum">Album</div>
						<div>Duration</div>
					</div>
					{value.map((track, i) => {
						return (<Track downloadManager={undefined} Audio={Audio} track={track} key={i} />)
					})}
				</div>
			);
		})
	});

	return (
		<div>
			{Content}
		</div>
	);
}

export default Library;