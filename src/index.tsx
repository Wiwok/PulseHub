import ReactDOM from 'react-dom/client';

import App from './App';

import './style.scss';

const BASEURL = 'http://localhost:8080/api';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);

export { BASEURL };
