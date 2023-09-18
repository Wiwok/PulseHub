import { useState } from "react";

import Download from '../Assets/Download.png';
import Play from '../Assets/Play.png';

import Player from "../Player";
import { toReadableDuration } from "../Utils/Cleaner";
import DownloadManager from "../Utils/DownloadManager";

function Track({ track, Audio, downloadManager }: { track: Track, Audio: Player, downloadManager: DownloadManager | undefined }) {
	const [playVisible, setplayVisible] = useState('trackPlayButton');

	return (
		<div className="track" onMouseEnter={() => setplayVisible("trackPlayButtonVisible")} onMouseLeave={() => setplayVisible("trackPlayButton")}>
			<div className="trackInfo">
				<img className="trackImage" src={track.album.images[1].url}></img>
				<img className={playVisible} onClick={() => {
					window.api.readTrack(track.id).then(Buffer => {
						if (!(Buffer instanceof Error)) {
							Audio.load(Buffer, track);
						} else {
							Audio.load(track.preview_url, track);
						}
					})
				}} src={Play}></img>
				<div className="trackNameArtist">
					<div className="trackName">{track.name}</div>
					<div className="trackArtists">
						{track.artists.map((element, i) => {
							if (i != track.artists.length - 1)
								return (<div key={i} className="trackArtistContainer"><div className="trackArtist">{element.name}</div>,</div>);
							else
								return (<div key={i} className="trackArtistContainer"><div className="trackArtist">{element.name}</div></div>);
						})}
					</div>
				</div>
			</div>
			<div className="trackAlbumContainer">
				<div className="trackAlbum">
					{track.album.name}
				</div>
			</div>
			<div className="trackDuration">
				{toReadableDuration(track.duration_ms / 1000)}
			</div>
			<div className="trackActionButton">
				{typeof downloadManager != 'undefined' ?
					<img src={Download} className="trackDownload" onClick={() => {
						downloadManager.once('Started', track.id, () => {
							console.log('Started !');
						});
						window.api.downloadTrack(track);
						downloadManager.once('Finished', track.id, () => {
							console.log('Finished !');
							window.api.readTrack(track.id).then(buffer => {
								if (!(buffer instanceof Error)) {
									Audio.load(buffer, track);
								}
							});
						});
					}} />
					:
					<></>
				}
				<div className="trackLike">♡</div>
				<div className="trackOption">•••</div>
			</div>
		</div >
	)
}

export default Track;