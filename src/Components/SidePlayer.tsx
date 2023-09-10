import { useEffect, useState, useRef } from "react";

import Back from '../Assets/Back.png'
import Play from '../Assets/Play.png'
import Pause from '../Assets/Pause.png'
import Disk from '../Assets/Disk.png'

import Player from "../Player";
import { toReadableArtists, toReadableDuration } from "../Utils/Cleaner";

function ProgressBar({ progressBarRef, rangeValue, setRangeValue, onClickDown, onClickUp, max }) {
	return (
		<input
			type="range"
			min="0"
			max={max}
			ref={progressBarRef}
			value={rangeValue}
			onMouseDown={onClickDown}
			onMouseUp={onClickUp}
			onChange={ev => setRangeValue(ev.target.value)}
		/>
	);
}

export default function SidePlayer({ Audio }: { Audio: Player }) {
	const [Playing, setPlaying] = useState(Play);
	const [Track, setTrack] = useState<Track | null>(null);
	const [rangeValue, setRangeValue] = useState(NaN);
	const progressBarRef = useRef();
	const progressBarClicked = useRef(false);

	Audio.on('Paused', () => setPlaying(Play));
	Audio.on('Playing', () => setPlaying(Pause));
	Audio.on('Loaded', () => setTrack(Audio.track));
	Audio.on('Ended', () => setTrack(null));


	function onClickDown() {
		progressBarClicked.current = true;
	};

	function onClickUp() {
		// @ts-ignore
		Audio.AudioElement.currentTime = progressBarRef.current.value;
		progressBarClicked.current = false;
	}

	function UpdateProgressBar() {
		if (!progressBarClicked.current && Audio.status == 'Playing')
			setRangeValue(parseInt((Audio.AudioElement.currentTime).toFixed()));
	}

	useEffect(() => {
		setInterval(UpdateProgressBar, 1000);
	}, [setRangeValue]);

	return (
		<>
			{
				Track != null ?
					<div className='sidePlayer'>
						<img className="sidePlayerImage" src={Track?.album.images[1].url ?? Disk} />
						<div className="sidePlayerprogress">
							{toReadableDuration(rangeValue)}
							<ProgressBar
								setRangeValue={setRangeValue}
								rangeValue={isNaN(rangeValue) ? 0 : rangeValue}
								onClickUp={onClickUp}
								onClickDown={onClickDown}
								progressBarRef={progressBarRef}
								max={Audio.AudioElement.duration.toFixed(0)} />
							{toReadableDuration(parseInt(Audio.AudioElement.duration.toFixed(0)))}
						</div>
						<div className="sidePlayerInfo">
							<div className="sidePlayerInfoLeft">
								<div className="sidePlayerInfoTitle">{Track?.name}</div>
								<div className="sidePlayerInfoArtist">{Track?.artists?.length ? toReadableArtists(Track.artists) : 'Unknown artist'}</div>
							</div>
							<div className="sidePlayerInfoRight">•••</div>
						</div>
						<div className="sidePlayerControl">
							<img src={Back} alt="Back" className="sidePlayerControlBack" />
							<img src={Playing} alt="Play/Pause" className="sidePlayerControlerPlay" onClick={() => Audio.togglePlay()} />
							<img src={Back} alt="Skip" className="sidePlayerControlSkip" />
						</div>
					</div> : <></>
			}
		</>
	);
}