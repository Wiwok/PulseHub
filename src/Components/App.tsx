import { useState } from "react";

import Player from "../Player";
import Search from "./Search";
import SideBar from "./SideBar";

import DownloadManager from "../Utils/DownloadManager";
import Library from "./Library";

const Audio = new Player();
const downloadManager = new DownloadManager();

function App() {
	const [Page, setPage] = useState('');

	return (
		<div className="App">
			<div className='SideBarPlaceHolder'></div>
			<SideBar setPage={setPage} Audio={Audio} />
			{(() => {
				switch (Page) {
					case '':
						return (<>Welcome !</>);
					case 'Search':
						return (<Search downloadManager={downloadManager} Audio={Audio} />);
					case 'Library':
						return (<Library Audio={Audio} />);
					default:
						return (<>Oops... Page not found...</>);
				}
			})()}
		</div>
	);
}

export default App;
