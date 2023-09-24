import { useEffect, useRef, useState } from 'react';

import Back from '../Assets/Back.png';
import Disk from '../Assets/Disk.png';
import Pause from '../Assets/Pause.png';
import Play from '../Assets/Play.png';

import { toReadableArtists, toReadableDuration } from '../Utils/Cleaner';
import PlayerManager from '../Utils/PlayerManager';

function ProgressBar({ rangeValue, setRangeValue, Audio }) {
	const progressBarRef: any = useRef();
	const progressBarClicked = useRef(false);

	function onClickDown() {
		progressBarClicked.current = true;
	}

	function onClickUp() {
		Audio.player.AudioElement.currentTime = progressBarRef?.current?.value;
		progressBarClicked.current = false;
	}

	function UpdateProgressBar() {
		if (!progressBarClicked.current && Audio.player.status == 'Playing')
			setRangeValue(parseInt(Audio.player.AudioElement.currentTime.toFixed()));
	}

	useEffect(() => {
		setInterval(UpdateProgressBar, 1000);
	}, [setRangeValue]);

	return (
		<input
			type="range"
			min="0"
			max={Audio.player.AudioElement.duration.toFixed(0)}
			ref={progressBarRef}
			value={rangeValue}
			onMouseDown={onClickDown}
			onMouseUp={onClickUp}
			onChange={ev => setRangeValue(ev.target.value)}
		/>
	);
}

function SidePlayer({ Audio: PlayerManager }: { Audio: PlayerManager }) {
	const [Playing, setPlaying] = useState(Play);
	const [Track, setTrack] = useState<Track | null>(null);
	const [rangeValue, setRangeValue] = useState(NaN);

	PlayerManager.player.on('Paused', () => setPlaying(Play));
	PlayerManager.player.on('Playing', () => setPlaying(Pause));
	PlayerManager.player.on('Loaded', () => setTrack(PlayerManager.player.track));
	PlayerManager.player.on('Ended', () => {
		setTrack(null);
		setRangeValue(0);
	});

	if (Track != null) {
		return (
			<div className="sidePlayer">
				<img className="sidePlayerImage" src={Track?.album?.images[1]?.url ?? Disk} />
				<div className="sidePlayerProgress">
					{toReadableDuration(rangeValue)}
					<ProgressBar
						setRangeValue={setRangeValue}
						rangeValue={isNaN(rangeValue) ? 0 : rangeValue}
						Audio={PlayerManager}
					/>
					{toReadableDuration(parseInt(PlayerManager.player.AudioElement.duration.toFixed(0)))}
				</div>
				<div className="sidePlayerInfo">
					<div className="sidePlayerInfoLeft">
						<div className="sidePlayerInfoTitle">{Track?.name}</div>
						<div className="sidePlayerInfoArtist">{toReadableArtists(Track.artists)}</div>
					</div>
					<div className="sidePlayerInfoRight">•••</div>
				</div>
				<div className="sidePlayerControl">
					<img
						src={Back}
						alt="Back"
						className="sidePlayerControlBack"
						onClick={PlayerManager.previewTrack.bind(PlayerManager)}
					/>
					<img
						src={Playing}
						alt="Play/Pause"
						className="sidePlayerControllerPlay"
						onClick={PlayerManager.player.togglePlay.bind(PlayerManager.player)}
					/>
					<img
						src={Back}
						alt="Skip"
						className="sidePlayerControlSkip"
						onClick={() => PlayerManager.nextTrack.bind(PlayerManager)(false)}
					/>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
}

export default SidePlayer;
