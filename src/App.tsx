import { useState } from 'react';

import MenuPlayer from './Components/MenuPlayer';
import Search from './Components/Search';
import PlayerManager from './Utils/PlayerManager';

// const Audio = new PlayerManager();
// const YTPlayer = useRef(null);

// Audio.player.YTPlayerRef = YTPlayer;
// useEffect(() => {
// 	Audio.player.initialize();
// }, [YTPlayer]);

function App() {
	const [page, setPage] = useState(<></>);

	const Audio = new PlayerManager();

	return (
		<div className="App">
			<div className="topBar">
				<div className="appName">PulseHub</div>
				<Search setPage={setPage} />
			</div>
			<div className="page">
				<div className="menu">
					<div className="menuCategory">Your music</div>
					<div className="menuCategoryElement">Songs</div>
					<div className="menuCategoryElement">Album</div>
					<div className="menuCategoryElement">Artist</div>
					<div className="menuCategory">Your playlists</div>
					<MenuPlayer Audio={Audio} />
				</div>
				<div className="appPage">{page}</div>
			</div>
		</div>
	);
}

export default App;
