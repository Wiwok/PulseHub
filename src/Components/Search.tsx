import { useState } from "react";

import Track from "./Track";

function Search({ Audio }) {
	const [Content, setContent] = useState(<></>);

	function Action(ev: any) {
		if (ev.key == 'Enter') {
			setContent(<>Searching...</>);
			const input = (document.getElementById('input') as HTMLInputElement).value;
			window.api.searchTrack(input).then(v => {
				// @ts-ignore
				v = v?.filter(val => val.album.album_type != 'compilation');
				if (v && v.length) {
					setContent(<div className="SearchResults">
						{v.map((track, i) => {
							return (<Track Audio={Audio} track={track} key={i} />)
						})}
					</div>);
				} else {
					setContent(<>No result</>);
				}
			});
		}
	}

	return (
		<div>
			<input onKeyUp={Action} id='input'></input>
			{Content}
		</div>
	);
}

export default Search;