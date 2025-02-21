import RetryArrow from '../Assets/RetryArrow';
import Job from '../Classes/Job';

function DownloadJob({ job }: { job: Job }) {
	function Loader() {
		const status = job.getStatus();

		if (status == 'Done') {
			return <></>;
		} else if (status == 'Downloading') {
			return (
				<div className="DownloadLoading">
					<div className="dotLoader" />
				</div>
			);
		} else if (status == 'Errored') {
			return (
				<div className="DownloadLoading">
					<RetryArrow onClick={retry} />
				</div>
			);
		}

		return <></>;
	}

	function retry() {
		job.retry();
	}

	return (
		<div className={job.getStatus() == 'Errored' ? 'Download DownloadError' : 'Download'}>
			<div className="DownloadImage">
				<img
					src={job.song.thumbnails.at(-1)?.url}
					alt="Song cover"
					onError={e => (e.currentTarget.src = '/Assets/Icons/MusicIcon.svg')}
				/>
			</div>
			<div className="DownloadLabel">
				<div>{job.song.name}</div>
				<div>{job.song.artist.name}</div>
			</div>
			<Loader />
		</div>
	);
}

export default DownloadJob;
