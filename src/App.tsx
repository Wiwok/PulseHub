import { useEffect, useRef, useState } from 'react';
import PlayerManager from './Utils/PlayerManager';
import MenuPlayer from './Components/MenuPlayer';
import Search from './Components/Search';

// const Audio = new PlayerManager();
// const YTPlayer = useRef(null);

// Audio.player.YTPlayerRef = YTPlayer;
// useEffect(() => {
// 	Audio.player.initialize();
// }, [YTPlayer]);

const [page, setpage] = useState(<></>);

function App() {
	return (
		<div className="App">
			<div className="topBar">
				<div className="appName">PulsHub</div>
				<Search setPage={setpage} />
			</div>
			<div className="page">
				<div className="menu">
					<div className="menuCategory">Your music</div>
					<div className="menuCategoryElement">Soungs</div>
					<div className="menuCategoryElement">Album</div>
					<div className="menuCategoryElement">Artist</div>
					<div className="menuCategory">Your playlist</div>
					{/* <MenuPlayer Audio={Audio} /> */}
				</div>
				<div className="appPage"></div>
			</div>
		</div>
	);
}

export default App;
