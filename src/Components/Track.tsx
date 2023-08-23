import { useState } from "react";
import Play from '../Assets/Play.png';
function calculTime(ms: number): string {
	if (ms < 60_000 || ms > 86_400_000) {
		return (Math.round(ms / 1000).toString() + 's')
	}
	const seconds = Math.round(ms / 1_000);
	const hours = Math.round(seconds / 3_600);
	const minutes = Math.round((seconds % 3_600) / 60);
	const remainingSeconds = seconds % 60;

	const hoursStr = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
	const minutesStr = minutes > 0 || hours > 0 ? `${minutes.toString().padStart(2, '0')}:` : '';
	const secondsStr = `${remainingSeconds.toString().padStart(2, '0')}`;

	return `${hoursStr}${minutesStr}${secondsStr}`;
}
export default function Track({ track }: { track: Track }) {
	const [playVisible, setplayVisible] = useState('trackPlayButon')
	return (
		<div className="track" onMouseEnter={() => { setplayVisible("trackPlayButonVisible") }} onMouseLeave={() => { setplayVisible("trackPlayButon") }}>
			<div className="trackInfo">
				<img className="trackImage" src={track.album.images[2].url}></img>
				<img className={playVisible} onClick={() => {/* todo */ }} src={Play}></img>
				<div className="trackNameArtist">
					<div className="trackName">{track.name}</div>
					<div className="trackArtists">
						{track.artists.map((element, i) => {
							if (i != track.artists.length - 1)
								return (<div className="trackArtistContainer"><div className="trackArtist"> {element.name}</div>,</div>);
							else
								return (<div className="trackArtistContainer"><div className="trackArtist">{element.name}</div></div>);
						})}
					</div>
				</div>
			</div>
			<div className="trackAlbum">
				{track.album.name}
			</div>
			<div className="trackDuration">
				{calculTime(track.duration_ms)}
			</div>
			<div className="trackActionButon">
				<div className="trackDownload">⍌</div>
				<div className="trackLike"> ♡ </div>
				<div className="trackOption">•••</div>
			</div>
		</div >
	)
}