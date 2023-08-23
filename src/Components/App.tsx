import { useState } from "react";
import Track from "./Track";

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
			if (v) {
				SetState(<div>
					<Track track={v[0]} />
					<Track track={v[1]} />
					<Track track={v[2]} />
				</div>)
			}
			else {
				SetState(<>No result</>);
			}
		});
	}

	return (
		<div className="App">
			{Page}
			<input id='input'></input>
			<br />
			<button onClick={Action}>Search</button>
			<br />
			{State}
		</div>
	);
}

export default App;
