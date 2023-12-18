import PlayListObj from '../Utils/PlayListObj';
import PlayerManager from '../Utils/PlayerManager';

function Advanced({ Audio }: { Audio: PlayerManager }) {
	return (
		<div className="DefaultPage">
			<div>Listen a Youtube Playlist</div>
			<input
				onKeyUp={ev => {
					if (ev.key == 'Enter') {
						console.log("Let's go !");
						const value = (document.getElementById('input') as HTMLInputElement).value;
						if (value == '') {
							return;
						}
						window.api.getYoutubeIDsFromPlaylistID(value).then(val => {
							if (val) {
								//1aRtduEHwvk2AMR87ji9Tg
								//ccJaLAXKpS4
								//PLyBpB3ighZijdaq0QsA77iQVvE39gJ9-U
								window.api.getYoutubeIDsFromPlaylistID(value).then(values => {
									if (values) {
										const playlist = new PlayListObj(value, 'YoutubePlaylist', values);
										Audio.loadPlayListObj(playlist);
										console.log(playlist);
										Audio.play();
									}
								});
							}
						});
					}
				}}
				className="searchInput"
				id="input"
				placeholder="Playlist ID"
			></input>
		</div>
	);
}

export default Advanced;
