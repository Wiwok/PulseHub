import { useState } from 'react';

import Search from './Search';
import SideBar from './SideBar';

import DownloadManager from '../Utils/DownloadManager';
import PlayerManager from '../Utils/PlayerManager';
import Library from './Library';
import PlayList from './PlayList';

const Audio = new PlayerManager();
const downloadManager = new DownloadManager();

function App() {
	const [Page, setPage] = useState('');

	return (
		<div className="App">
			<div className="SideBarPlaceHolder"></div>
			<SideBar setPage={setPage} Audio={Audio} />
			{(() => {
				switch (Page) {
					case '':
						return <>Welcome !</>;
					case 'Search':
						return <Search downloadManager={downloadManager} Audio={Audio} />;
					case 'Library':
						return <Library Audio={Audio} />;
					case 'PlayList':
						return <PlayList Player={Audio} />;
					default:
						return <>Oops... Page not found...</>;
				}
			})()}
		</div>
	);
}

export default App;
