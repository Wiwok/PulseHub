import { createRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SongDetailed } from 'ytmusic-api';

import Downloader from './Classes/Downloader';
import Player from './Classes/Player';
import DownloadList from './Components/DownloadList';
import LeftBar from './Components/LeftBar';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import Search from './Pages/Search';

function App() {
	const player = createRef<Player>();
	const downloader = new Downloader(update);

	const ROUTES = [
		{ link: '/', page: <HomePage /> },
		{
			link: '/search',
			page: <Search player={player} download={(song: SongDetailed) => downloader.add(song)} />
		}
	];

	const downloadListRef = createRef<DownloadList>();

	function update() {
		if (downloadListRef.current) {
			downloadListRef.current.forceRender();
		}
	}

	return (
		<div className="App">
			<BrowserRouter>
				<Navbar />
				<div className="AppInner">
					<LeftBar player={player} downloadListRef={downloadListRef} downloader={downloader} />
					<div className="AppContainer">
						<Routes>
							{ROUTES.map((v, i) => (
								<Route key={i} path={v.link} element={v.page} />
							))}
						</Routes>
					</div>
				</div>
				<Player ref={player} />
			</BrowserRouter>
		</div>
	);
}

export default App;
