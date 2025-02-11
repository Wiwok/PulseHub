import { useState } from 'react';
import Job from './Job';

function Downloader() {
	const [Downloads, setDownloads] = useState<Array<Job>>();

	return <div className="Downloads"></div>;
}

export default Downloader;
