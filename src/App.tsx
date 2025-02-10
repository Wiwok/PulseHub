import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import Search from './Pages/Search';

function App() {
	const ROUTES = [
		{ link: '/', page: <HomePage /> },
		{ link: '/search', page: <Search /> }
	];

	return (
		<div className="App">
			<BrowserRouter>
				<Navbar />
				<Routes>
					{ROUTES.map((v, i) => (
						<Route key={i} path={v.link} element={v.page} />
					))}
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
