import Player from '../Player';
import SidePlayer from './SidePlayer';

import Home from '../Assets/Home.png';
import Search from '../Assets/Search.png';

function SideBar({ Audio, setPage }: { Audio: Player, setPage: Function }) {
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
			</div>
			<SidePlayer Audio={Audio} />
		</div>
	);
}

export default SideBar;