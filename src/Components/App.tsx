import { useState } from "react";

import Player from "../Player";
import Search from "./Search";
import SideBar from "./SideBar";

const Audio = new Player();

function App() {
	const [ActivePage, SetActivePage] = useState('');

	let Page = <></>;
	switch (ActivePage) {
		case '':
			Page = <>Welcome !</>;
			break;
		case 'Search':
			Page = <Search Audio={Audio} />;
			break;
	}

	return (
		<div className="App">
			<div className='SideBarPlaceHolder'></div>
			<SideBar SetActivePage={SetActivePage} Audio={Audio} />
			{Page}
		</div>
	);
}

export default App;
