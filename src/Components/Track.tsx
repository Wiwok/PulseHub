import { useState } from "react";
import Play from '../Assets/Play.png';
import Player from "../Player";
import calculTime from "../utils/calculTime";
export default function Track({ track, Audio }: { track: Track, Audio: Player }) {
	const [playVisible, setplayVisible] = useState('trackPlayButon')
	return (
		<div className="track" onMouseEnter={() => { setplayVisible("trackPlayButonVisible") }} onMouseLeave={() => { setplayVisible("trackPlayButon") }}>
			<div className="trackInfo">
				<img className="trackImage" src={track.album.images[1].url}></img>
				<img className={playVisible} onClick={() => { Audio.load(track.preview_url) }} src={Play}></img>
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
			<div className="trackAlbumContainer">
				<div className="trackAlbum">
					{track.album.name}
				</div>
			</div>
			<div className="trackDuration">
				{calculTime(track.duration_ms)}
			</div>
			<div className="trackActionButon">
				<div className="trackDownload" onClick={() => {
					window.api.downloadTrack(track, './');
					window.api.downloadTrackHandle((ev, value) => {
						if (value.status == 'Finished') {
							window.api.readTrack(track.id).then(test => {
								if (!(test instanceof Error)) {
									Audio.load(test).then(() => Audio.play());
								}
							})
						}
					});
				}}>⍌</div>
				<div className="trackLike"> ♡ </div>
				<div className="trackOption">•••</div>
			</div>
		</div >
	)
}