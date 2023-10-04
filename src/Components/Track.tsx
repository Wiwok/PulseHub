import { useState } from 'react';

import Download from '../Assets/Download.png';
import Play from '../Assets/Play.png';
import Success from '../Assets/Success.png';

import { toReadableDuration } from '../Utils/Cleaner';
import DownloadManager from '../Utils/DownloadManager';
import PlayerManager from '../Utils/PlayerManager';
import ContextMenu from './ContextMenu';
import PlayListObj from '../Utils/PlayListObj';
const playlist = new PlayListObj('123', 'test');
function Track({
	track,
	Audio,
	downloadManager,
	downloadedTracks,
	setContextMenu,
	onClick
}: {
	track: Track;
	Audio: PlayerManager;
	downloadManager: DownloadManager | undefined;
	downloadedTracks: Map<string, Track> | undefined;
	setContextMenu: Function;
	onClick?: Function;
}) {
	const [playVisible, setplayVisible] = useState('trackPlayButton');
	const [Downloaded, setDownloaded] = useState(downloadedTracks ? downloadedTracks.has(track.id) : false);

	const contextMenu = new ContextMenu(
		setContextMenu,
		(() => {
			const options = [
				{ callback: play, value: 'Play' },
				{ callback: () => window.api.savePlaylist(playlist), value: 'save playlist' },
				{ callback: () => playlist.addTrack('1bdm32mVmoGcek5bVKxQKd'), value: 'add' }
			];
			if (typeof downloadManager == 'undefined' || Downloaded) {
				options.push({ callback: deleteTrack, value: 'Delete' });
			} else {
				options.push({ callback: download, value: 'Download' });
			}
			return options;
		})()
	);

	function deleteTrack() {
		return new Promise<boolean>(resolve => {
			if (!Downloaded) resolve(false);
			window.api.removeTrack(track.id).then(resolve);
		});
	}

	function download() {
		if (typeof downloadManager != 'undefined') {
			if (Downloaded) return;
			window.api.downloadTrack(track);
			downloadManager.once('Finished', track.id, () => {
				setDownloaded(true);
			});
			downloadManager.once('Errored', track.id, () => {
				console.log('An error occurred when downloading ' + track.name);
			});
		}
	}

	function play() {
		if (Downloaded) {
			Audio.load(track);
		} else if (typeof downloadManager != 'undefined') {
			Audio.player.load(track.id, track);
		}
	}

	return (
		<div
			className="track"
			onMouseEnter={() => setplayVisible('trackPlayButtonVisible')}
			onMouseLeave={() => setplayVisible('trackPlayButton')}
			onDoubleClick={() => {
				if (onClick) onClick();
			}}
			onContextMenu={contextMenu.click.bind(contextMenu)}
		>
			<div className="trackInfo">
				<img className="trackImage" src={track?.album?.images[1].url}></img>
				<img
					className={playVisible}
					onClick={() => {
						if (onClick) onClick();
					}}
					src={Play}
				></img>
				<div className="trackNameArtist">
					<div className="trackName">{track?.name}</div>
					<div className="trackArtists">
						{track?.artists?.map((element, i) => {
							if (i != track.artists.length - 1)
								return (
									<div key={i} className="trackArtistContainer">
										<div className="trackArtist">{element.name}</div>,
									</div>
								);
							else
								return (
									<div key={i} className="trackArtistContainer">
										<div className="trackArtist">{element.name}</div>
									</div>
								);
						})}
					</div>
				</div>
			</div>
			<div className="trackAlbumContainer">
				<div className="trackAlbum">{track?.album?.name}</div>
			</div>
			<div className="trackDuration">{toReadableDuration(track?.duration_ms / 1000)}</div>
			<div className="trackActionButton">
				{(() => {
					if (typeof downloadManager != 'undefined') {
						return (
							<img src={Downloaded ? Success : Download} className="trackDownload" onClick={download} />
						);
					} else {
						return <></>;
					}
				})()}
				<div className="trackLike">♡</div>
				<div className="trackOption">•••</div>
			</div>
		</div>
	);
}

export default Track;
