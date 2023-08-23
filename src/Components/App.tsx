import { useState } from "react";
import Track from "./Track";

import Player from "../Player";

const Audio = new Player();

function App() {
	const [ActivePage, SetActivePage] = useState('');
	const [State, SetState] = useState(<></>);

	let Page = <></>;
	switch (ActivePage) {
		case 'Home':
			Page = <>Welcome !</>;
			break;
	}

	function Action() {
		SetState(<>Searching...</>);
		const input = (document.getElementById('input') as HTMLInputElement).value;
		window.api.searchTrack(input).then(v => {
			if (v && v.length) {
				SetState(<div>
					{v[0].name}
					<br />
					<img src={v[0].album.images[1].url} />
				</div>);
				window.api.downloadTrack(v[0], './');
				window.api.downloadTrackHandle((ev, value) => {
					if (value.status == 'Finished') {
						window.api.readTrack(v[0].id).then(test => {
							if (!(test instanceof Error)) {
								Audio.load(test).then(() => Audio.play());
							}
						})
					}
				});
			}
			else {
				SetState(<>No result</>);
			}
		});
	}

	function Action2() {
		Audio.togglePlay();
	}

	return (
		<div className="App">
			{Page}
			<input id='input'></input>
			<br />
			<button onClick={Action}>Play</button>
			<br />
			<button onClick={Action2}>Status</button>
			<br />
			{State}
		</div>
	);
}

export default App;
