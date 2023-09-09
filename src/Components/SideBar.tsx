import home from '../Assets/home.png';
import search from '../Assets/search.png';
import Player from '../Player';
import SidePlayer from './SidePlayer';
function SideBar({ Audio }: { Audio: Player }) {
	return (
		<div className="sideBar">
			<div className="sideMenu">
				<div className="sideMenuButton">
					<img src={home} alt="home" className="sideMenuIcon" />
					<div className="sideMenuText">home</div>
				</div>
				<div className="sideMenuButton">
					<img src={search} alt="home" className="sideMenuIcon" />
					<div className="sideMenuText">search</div>
				</div>
			</div>
			<SidePlayer Audio={Audio} />
		</div>
	);
}

export default SideBar;