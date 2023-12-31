import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

import Search from './Components/Search';
import SideBar from './Components/SideBar';

import Library from './Components/Library';
import PlayList from './Components/PlayList';
import DownloadManager from './Utils/DownloadManager';
import PlayerManager from './Utils/PlayerManager';
import Advanced from './Components/Advanced';

const downloadManager = new DownloadManager();
const Audio = new PlayerManager();

function App() {
	const [Page, setPage] = useState('');
	const [ContextMenu, setContextMenu] = useState(<></>);
	const YTPlayer = useRef(null);

	Audio.player.YTPlayerRef = YTPlayer;

	useEffect(() => {
		Audio.player.initialize();
	}, [YTPlayer]);

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
						return <PlayList setContextMenu={setContextMenu} Audio={Audio} />;
					case 'Advanced':
						return <Advanced Audio={Audio} />;
					default:
						return <>Oops... Page not found...</>;
				}
			})()}
			{ContextMenu}
			<YouTube opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }} ref={YTPlayer} />
		</div>
	);
}

export default App;
