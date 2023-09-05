import { useState } from "react";

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
			// @ts-ignore
			v = v?.filter(val => val.album.album_type != 'compilation');
			const number = 0;
			if (v && v.length) {
				SetState(<div>
					{v[number].name} - {v[number].artists[0].name}
					<br />
					<img src={v[number].album.images[1].url} />
				</div>);
				window.api.readTrack(v[number].id).then(value => {
					if (!(value instanceof Error)) {
						Audio.load(value).then(() => Audio.play());
					} else {
						// @ts-ignore
						window.api.downloadTrack(v[number], './');
						window.api.downloadTrackHandle((ev, value) => {
							console.log(value);
							if (value.status == 'Finished') {
								// @ts-ignore
								window.api.readTrack(v[number].id).then(test => {
									if (!(test instanceof Error)) {
										Audio.load(test).then(() => Audio.play());
									}
								});
							}
						});
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

	function GetEnter(ev: any) {
		if (ev.key == 'Enter') {
			Action();
		}
	}

	return (
		<div className="App">
			{Page}
			<input onKeyUp={GetEnter} id='input'></input>
			<br />
			<button onClick={Action}>Download</button>
			<br />
			<button onClick={Action2}>Status</button>
			<br />
			{State}
		</div>
	);
}

export default App;
