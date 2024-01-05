import { useState } from 'react';

import Play from '../Assets/Play.svg';
import PlaylistAdd from '../Assets/PlaylistAdd.svg';

import { toReadableDuration } from '../Utils/Cleaner';
import DownloadManager from '../Utils/DownloadManager';
import PlayerManager from '../Utils/PlayerManager';
import ContextMenu from './ContextMenu';

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
	const [Downloaded, setDownloaded] = useState(downloadedTracks ? downloadedTracks.has(track.id) : false);

	const contextMenu = new ContextMenu(
		setContextMenu,
		(() => {
			const options = [{ callback: play, value: 'Play' }];
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
			onDoubleClick={() => {
				if (onClick) onClick();
			}}
			onContextMenu={contextMenu.click.bind(contextMenu)}
		>
			<div className="trackLeft">
				<img className="trackImage" src={track?.album?.images[1].url}></img>
				<div className="trackDescription">
					<div className="trackName">{track.name}</div>
					<div className="trackArtists">
						{track?.artists?.map((element, i) => {
							if (i != track.artists.length - 1)
								return (
									<div key={i} className="trackArtist">
										{element.name},&nbsp;
									</div>
								);
							else
								return (
									<div key={i} className="trackArtist">
										{element.name}
									</div>
								);
						})}
					</div>
					<div className="trackDate">{track.album.release_date.split('-')[0]}</div>
				</div>
			</div>
			<div className="trackRight">
				<div className="trackDuration">{toReadableDuration(track?.duration_ms / 1000)}</div>
				<img
					src={Play}
					className="trackPlayImage"
					onClick={() => {
						Audio.load(track);
					}}
				></img>
				<img src={PlaylistAdd} className="trackPlaylistAdd"></img>
			</div>
		</div>
	);
}

export default Track;
