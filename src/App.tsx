import { useRef, useState } from 'react';

import Search from './Components/Search';
import SideBar from './Components/SideBar';

import Library from './Components/Library';
import PlayList from './Components/PlayList';
import DownloadManager from './Utils/DownloadManager';
import PlayerManager from './Utils/PlayerManager';

const downloadManager = new DownloadManager();
const Audio = new PlayerManager();

function App() {
	const [Page, setPage] = useState('');
	const [ContextMenu, setContextMenu] = useState(<></>);
	const YTPlayer = useRef(null);

	Audio.player.YTPlayerRef = YTPlayer;

	return (
		<div className="App" onContextMenu={ev => ev.preventDefault()}>
			<div className="SideBarPlaceHolder"></div>
			<SideBar setPage={setPage} Audio={Audio} />
			{(() => {
				switch (Page) {
					case '':
						return <>Welcome !</>;
					case 'Search':
						return (
							<Search setContextMenu={setContextMenu} downloadManager={downloadManager} Audio={Audio} />
						);
					case 'Library':
						return <Library setContextMenu={setContextMenu} Audio={Audio} />;
					case 'PlayList':
						return <PlayList setContextMenu={setContextMenu} Player={Audio} />;
					default:
						return <>Oops... Page not found...</>;
				}
			})()}
			{ContextMenu}
			<iframe style={{ height: 0, width: 0, border: 'none' }} ref={YTPlayer}></iframe>
		</div>
	);
}

export default App;
