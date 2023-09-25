import SidePlayer from './SidePlayer';

import Home from '../Assets/Home.png';
import Search from '../Assets/Search.png';
import PlayerManager from '../Utils/PlayerManager';

function SideBar({ Audio, setPage }: { Audio: PlayerManager; setPage: Function }) {
	return (
		<div className="sideBar">
			<div className="sideMenu">
				<div className="sideMenuButton" onClick={() => setPage('')}>
					<img src={Home} alt="Home" className="sideMenuIcon" />
					<div className="sideMenuText">Home</div>
				</div>
				<div className="sideMenuButton" onClick={() => setPage('Search')}>
					<img src={Search} alt="Search" className="sideMenuIcon" />
					<div className="sideMenuText">Search</div>
				</div>
				<div className="sideMenuButton" onClick={() => setPage('Library')}>
					<img src={Search} alt="Library" className="sideMenuIcon" />
					<div className="sideMenuText">Library</div>
				</div>
				<div className="sideMenuButton" onClick={() => setPage('PlayList')}>
					<img src={Search} alt="PlayList" className="sideMenuIcon" />
					<div className="sideMenuText">PlayList</div>
				</div>
			</div>
			<SidePlayer Audio={Audio} />
		</div>
	);
}

export default SideBar;
