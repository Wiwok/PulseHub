type JobEndStatus = 'Errored' | 'Done';

type SongData = {
	title: string;
	artist: string;
	artistID: string;
	duration: number;
	poster: string;
	posterLarge: string;
	plays_count: number;
	album: string;
	albumID: string;
};

type JobStatus = 'Queued' | 'Requested' | 'Downloading' | 'Done' | 'Errored';

export { JobEndStatus, JobStatus, SongData };
