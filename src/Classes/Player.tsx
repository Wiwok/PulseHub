import { createRef, PureComponent, RefObject } from 'react';
import YouTube from 'react-youtube';
import { SongDetailed } from 'ytmusic-api';

import { PlayerStatus } from '../../declarations';

interface Props {}

interface State {
	song: SongDetailed | undefined;
	status: PlayerStatus;
}

class Player extends PureComponent<Props, State> {
	private playerRef: RefObject<YouTube | null>;

	constructor(props: Props) {
		super(props);
		this.playerRef = createRef();
		this.state = { song: undefined, status: 'Ready' };
	}

	componentDidMount() {
		if (!this.playerRef.current) return;
		this.playerRef.current.onPlayerStateChange = ev => {
			if (ev.data == 0) {
				this.stop();
			} else if (ev.data == 1) {
				this.resume();
			} else if (ev.data == 1) {
				this.pause();
			}
		};
	}

	play(song: SongDetailed) {
		this.setState({ status: 'Playing', song: song });
		if (this.state.status != 'Ready') this.stop();
	}

	stop() {
		this.setState({ status: 'Ready', song: undefined });
		this.playerRef.current?.internalPlayer.stopVideo();
	}

	pause() {
		this.setState({ status: 'Paused' });
		this.playerRef.current?.internalPlayer.pauseVideo();
	}

	resume() {
		this.setState({ status: 'Playing' });
		this.playerRef.current?.internalPlayer.playVideo();
	}

	toggle() {
		if (this.state.status == 'Paused') {
			this.resume();
		} else if (this.state.status == 'Playing') {
			this.pause();
		}
	}

	async getProgress() {
		return parseFloat(await this.playerRef.current?.internalPlayer.getCurrentTime());
	}

	seekTo(progress: number) {
		this.playerRef.current?.internalPlayer.seekTo(progress);
	}

	render() {
		return (
			<YouTube
				ref={this.playerRef}
				videoId={this.state.song?.videoId ?? ''}
				opts={{
					playerVars: {
						autoplay: 1
					}
				}}
				onEnd={() => this.setState({ status: 'Ready' })}
				onPause={() => this.setState({ status: 'Paused' })}
				onPlay={() => this.setState({ status: 'Playing' })}
				style={{ width: 0, height: 0, overflow: 'hidden' }}
			/>
		);
	}
}
export default Player;
