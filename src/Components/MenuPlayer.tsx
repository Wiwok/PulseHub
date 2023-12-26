import { useEffect, useRef, useState } from 'react';

import Back from '../Assets/Back.png';
import Disk from '../Assets/Disk.png';
import Pause from '../Assets/Pause.png';
import Play from '../Assets/Play.png';

import { toReadableArtists, toReadableDuration } from '../Utils/Cleaner';
import PlayerManager from '../Utils/PlayerManager';

function ProgressBar({
	rangeValue,
	setRangeValue,
	Audio,
	duration,
	requestDuration
}: {
	rangeValue: number;
	setRangeValue: Function;
	Audio: PlayerManager;
	duration: number;
	requestDuration: Function;
}) {
	const progressBarRef: any = useRef(null);
	const progressBarClicked = useRef(false);

	function onClickDown() {
		progressBarClicked.current = true;
	}

	function onClickUp() {
		Audio.player.setProgress(progressBarRef?.current?.value);
		progressBarClicked.current = false;
	}

	function UpdateProgressBar() {
		if (!duration) requestDuration();
		if (!progressBarClicked.current && Audio.player.status == 'Playing')
			Audio.player.getProgress().then(value => setRangeValue(parseInt(value.toFixed())));
	}

	useEffect(() => {
		const interval = setInterval(UpdateProgressBar, 1000);
		return () => clearInterval(interval);
	}, [UpdateProgressBar]);

	return (
		<input
			type="range"
			min="0"
			max={!duration ? 0 : duration}
			ref={progressBarRef}
			value={rangeValue}
			onMouseDown={onClickDown}
			onMouseUp={onClickUp}
			onChange={ev => setRangeValue(ev.target.value)}
		/>
	);
}

function MenuPlayer({ Audio }: { Audio: PlayerManager }) {
	const [Playing, setPlaying] = useState(false);
	const [Track, setTrack] = useState<Track | null>(null);
	const [rangeValue, setRangeValue] = useState(0);
	const [duration, setDuration] = useState(NaN);

	function requestDuration() {
		Audio.player.getDuration().then(value => {
			setDuration(parseFloat(value.toFixed(0)));
		});
	}

	Audio.player.on('Paused', () => setPlaying(false));
	Audio.player.on('Playing', () => setPlaying(true));
	Audio.player.on('Loaded', () => {
		Audio.player.getDuration().then(value => {
			setDuration(parseFloat(value.toFixed(0)));
		});
		setTrack(Audio.player.track);
	});
	Audio.player.on('Ended', () => {
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
						rangeValue={rangeValue}
						Audio={Audio}
						duration={duration}
						requestDuration={requestDuration}
					/>
					{toReadableDuration(duration)}
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
						onClick={Audio.previewTrack.bind(Audio)}
					/>
					<img
						src={Playing ? Pause : Play}
						alt="Play/Pause"
						className="sidePlayerControllerPlay"
						onClick={Audio.player.togglePlay.bind(Audio.player)}
					/>
					<img
						src={Back}
						alt="Skip"
						className="sidePlayerControlSkip"
						onClick={() => Audio.nextTrack.bind(Audio)(false)}
					/>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
}

export default MenuPlayer;
