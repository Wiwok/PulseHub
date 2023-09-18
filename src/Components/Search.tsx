import { useState } from "react";

import Track from "./Track";
import SearchImg from "../Assets/Search.png"

function Search({ Audio, downloadManager }) {
	const [Content, setContent] = useState(<></>);

	function Action() {
		setContent(<>Searching...</>);
		const input = (document.getElementById('input') as HTMLInputElement).value;
		window.api.searchTrack(input).then(v => {
			if (v && v.length) {
				setContent(
					<div className="SearchResults">
						<div className="SearchResultsDescription">
							<div>Title</div>
							<div className="SearchResultsDescriptionAlbum">Album</div>
							<div>Duration</div>
						</div>
						{v.map((track, i) => {
							return (<Track downloadManager={downloadManager} Audio={Audio} track={track} key={i} />)
						})}
					</div>);
			} else {
				setContent(<>No result</>);
			}
		});
	}

	return (
		<div className="searchPage">
			<div className="searchBox">
				<input className="searchInput" onKeyUp={(ev) => { if (ev.key == 'Enter') Action() }} id='input' placeholder="your search"></input>
				<img src={SearchImg} onClick={Action} alt="search" className="searchButton"></img>
			</div>
			{Content}
		</div>
	);
}

export default Search;