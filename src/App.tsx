import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';

function App() {
	const ROUTES = [{ link: '/', page: <HomePage /> }];

	return (
		<div className="App">
			<Navbar />
			<BrowserRouter>
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
