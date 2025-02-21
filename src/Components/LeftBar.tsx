import { Ref, RefObject } from 'react';

import Downloader from '../Classes/Downloader';
import Player from '../Classes/Player';
import DownloadList from './DownloadList';
import SidePlayer from './SidePlayer';

function LeftBar({
	downloader,
	downloadListRef,
	player
}: {
	downloader: Downloader;
	downloadListRef: Ref<DownloadList>;
	player: RefObject<Player | null>;
}) {
	return (
		<div className="LeftBar">
			<DownloadList ref={downloadListRef} downloader={downloader} />
			<SidePlayer player={player} />
		</div>
	);
}

export default LeftBar;
