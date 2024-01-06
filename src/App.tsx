import { useEffect, useRef, useState } from 'react';

import MenuPlayer from './Components/MenuPlayer';
import Search from './Components/Search';
import PlayerManager from './Utils/PlayerManager';
import SearchPage from './Components/SearchPage';
import DownloadManager from './Utils/DownloadManager';
import YouTube from 'react-youtube';
import SongsList from './Components/SongsList';

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
		<div className="App">
			<div className="topBar">
				<div className="appName">PulseHub</div>
				<Search setPage={setPage} />
			</div>
			<div className="page">
				<div className="menu">
					<div>
						<div className="menuCategory">Your musicdi</div>
						<div
							className="menuCategoryElement"
							onClick={() => {
								setPage('Songs');
							}}
						>
							Songs
						</div>
						<div className="menuCategoryElement">Album</div>
						<div className="menuCategoryElement">Artist</div>
						<div className="menuCategory">Your playlists</div>
					</div>
					<MenuPlayer Audio={Audio} />
				</div>
				<div className="appPage">
					{(() => {
						switch (Page) {
							case '':
								return <>Welcome !</>;
							case 'Search':
								return (
									<SearchPage
										setContextMenu={setContextMenu}
										downloadManager={downloadManager}
										Audio={Audio}
									/>
								);
							case 'Songs':
								return <SongsList Audio={Audio} setContextMenu={setContextMenu} />;
							default:
								return <>Oops... Page not found...</>;
						}
					})()}
				</div>
			</div>
			{ContextMenu}
			<YouTube
				className="youtube"
				opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }}
				ref={YTPlayer}
			/>
		</div>
	);
}

export default App;
