import { useState } from "react";

import Player from "../Player";
import Search from "./Search";
import SideBar from "./SideBar";

import DownloadManager from "../Utils/DownloadManager";
import Library from "./Library";

const Audio = new Player();
const downloadManager = new DownloadManager();

function App() {
	const [ActivePage, SetActivePage] = useState('');

	let Page = <></>;
	switch (ActivePage) {
		case '':
			Page = <>Welcome !</>;
			break;
		case 'Search':
			Page = <Search downloadManager={downloadManager} Audio={Audio} />;
			break;
		case 'Library':
			Page = <Library Audio={Audio} />;
			break;
		default:
			Page = <>Oops... Page not found...</>;
	}

	window.api.getLocalTracks().then(console.log);

	return (
		<div className="App">
			<div className='SideBarPlaceHolder'></div>
			<SideBar SetActivePage={SetActivePage} Audio={Audio} />
			{Page}
		</div>
	);
}

export default App;
