import { RefObject, useEffect, useRef, useState } from 'react';

import Player from '../Classes/Player';

function ProgressBar({ player }: { player: RefObject<Player | null> }) {
	const [Progress, setProgress] = useState(0);
	const isProgressBarClicked = useRef(false);

	function onMouseDown() {
		isProgressBarClicked.current = true;
	}

	function onMouseUp() {
		player.current?.seekTo(Progress);
		isProgressBarClicked.current = false;
	}

	function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
		setProgress(parseFloat(ev.target.value));
	}

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!isProgressBarClicked.current) {
				const progress = await player.current?.getProgress();
				if (!progress || isNaN(progress)) {
					setProgress(0);
					return;
				}
				if (progress !== Progress) {
					setProgress(progress);
				}
			}
		}, 500);
		return () => clearInterval(interval);
	}, [Progress]);

	return (
		<input
			type="range"
			className="ProgressBar"
			min={0}
			max={player.current?.state.song?.duration ?? 0}
			value={Progress}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onChange={onChange}
		/>
	);
}

function SidePlayer({ player }: { player: RefObject<Player | null> }) {
	return (
		<div className="Player">
			{player.current?.state.song?.name}
			<button onClick={() => player.current?.resume()}>Resume</button>
			<button onClick={() => player.current?.pause()}>Pause</button>
			<button onClick={() => player.current?.toggle()}>Toggle</button>
			<div>{player.current?.state.status}</div>
			<ProgressBar player={player} />
		</div>
	);
}

export default SidePlayer;
