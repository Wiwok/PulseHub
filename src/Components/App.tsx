import { useState } from "react";

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
		window.api.searchArtist(input).then(v => {
			if (v && v.length) {
				SetState(<div>
					{v[0].name}
					<br />
					<img src={v[0].images[1].url} />
				</div>);
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
