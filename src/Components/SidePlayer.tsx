import { useEffect, useState } from "react";
import back from '../Assets/back.png'
import play from '../Assets/Play.png'
import pause from '../Assets/pause.png'
import Player from "../Player";
export default function SidePlayer({ Audio }: { Audio: Player }) {
	const [Playing, setPlaying] = useState(play)
	const [Progress, setProgress] = useState(Audio.AudioElement.currentTime)
	Audio.on('Paused', () => { setPlaying(play) });
	Audio.on('Playing', () => setPlaying(pause))
	useEffect(() => {
		setInterval(() => {
			setProgress(parseInt((Audio.AudioElement.currentTime).toFixed()));
		}, 1000);
	}, []);

	return (
		<div className='sidePlayer'>
			<img className="sidePlayerImage" src="https://i.scdn.co/image/ab67616d00001e02b33d46dfa2635a47eebf63b2" />
			<div className="sidePlayerprogress">
				{Progress}<input type="range" value={Progress} max={Audio.AudioElement.duration} id="progress" />{(Audio.AudioElement.duration).toFixed()}
			</div>
			<div className="sidePlayerInfo">
				<div className="sidePlayerInfoLeft">
					<div className="sidePlayerInfoTitle">one more time</div>
					<div className="sidePlayerInfoArtist">daft punk</div>
				</div>
				<div className="sidePlayerInfoRight">•••</div>
			</div>
			<div className="sidePlayerControl">
				<img src={back} alt="back" className="sidePlayerControlback" />
				<img src={Playing} alt="play/pause" className="sidePlayerControlerPlay" onClick={() => Audio.togglePlay()} />
				<img src={back} alt="front" className="sidePlayerControlfront" />
			</div>
		</div>
	);
}