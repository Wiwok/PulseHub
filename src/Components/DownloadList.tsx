import { Component } from 'react';

import Downloader from '../Classes/Downloader';
import DownloadJob from './DownloadJob';

interface Props {
	downloader: Downloader;
}

interface State {
	updateFlag: boolean;
}

class DownloadList extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { updateFlag: true };
	}

	forceRender() {
		this.setState({ updateFlag: !this.state.updateFlag });
	}

	render() {
		return (
			<div className="Downloads">
				{this.props.downloader.getJobs().map((res, i) => (
					<DownloadJob job={res} key={i} />
				))}
			</div>
		);
	}
}

export default DownloadList;
