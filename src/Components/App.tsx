import { useState } from "react";


function App() {
	const [ActivePage, SetActivePage] = useState('');

	let Page = <></>;
	switch (ActivePage) {
		case 'Home':
			Page = <>Welcome !</>;
			break;
	}

	return (
		<div className="App">
			{Page}
		</div>
	);
}

export default App;
