import { useState } from "react";

import Player from "../Player";
import Track from "./Track";
import SideBar from "./SideBar";

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
			if (v && v.length) {
				console.log(v);
				SetState(<div>
					{v.map((track, i) => {

						return (<Track Audio={Audio} track={track} key={i} />)
					})}
				</div>);
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
			<SideBar Audio={Audio} />
			{Page}
			<input onKeyUp={GetEnter} id='input'></input>
			<br />
			<button onClick={Action2}>play / pause</button>
			<br />
			{State}
		</div>
	);
}

export default App;
