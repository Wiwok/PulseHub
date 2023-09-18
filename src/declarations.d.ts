declare module "*.png";

type AlbumType = 'album' | 'single' | 'compilation'
type DownloadStatus = 'Started' | 'Errored' | 'Finished' | 'Ended';
type DownloadHandler = { event: DownloadStatus, id: string, callback: Function };

type Track = {
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: { isrc: string }
	external_urls: { spotify: string }
	name: string;
	href: string;
	id: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	artists: {
		name: string;
		href: string;
		external_urls: { spotify: string };
		id: string;
	}[];
	album: {
		album_type: AlbumType,
		artists: {
			name: string;
			href: string;
			external_urls: { spotify: string };
			id: string;
		}[];
		external_urls: { spotify: string };
		href: string;
		id: string;
		images: {
			height: number;
			url: string;
			width: number;
		}[];
		name: string;
		release_date: string;
		total_tracks: number;
	};
}

type Album = {
	album_type: AlbumType,
	artists: {
		name: string;
		href: string;
		external_urls: { spotify: string };
		id: string;
	}[];
	copyrights: {
		text: string;
		type: string;
	}[]
	external_ids: { upc: string };
	external_urls: { spotify: string };
	genres: string[];
	href: string;
	id: string;
	images: {
		height: number;
		url: string;
		width: number;
	}[];
	label: string;
	name: string;
	popularity: number;
	release_date: string;
	total_tracks: number;
	tracks: {
		href: string;
		items: {
			artists: {
				name: string;
				href: string;
				external_urls: { spotify: string };
				id: string;
			}[];
			disc_number: number;
			duration_ms: number;
			explicit: boolean;
			external_urls: { spotify: string };
			href: string;
			id: string;
			name: string;
			preview_url: string;
			track_number: number;
		}[];
	}
};

type Artist = {
	external_urls: { spotify: string };
	followers: { total: number };
	genres: string[];
	href: string;
	id: string;
	images: {
		height: number;
		url: string;
		width: number;
	}[];
	name: string;
	popularity: number;
};

interface Window {
	api: {
		downloadTrack: (track: Track) => void;
		downloadAlbum: (album: Album) => void;
		downloadTrackHandle: (callback: (event: any, value: { id: string, status: DownloadStatus }) => void) => void;
		downloadAlbumHandle: (callback: (event: any, value: { id: string, status: DownloadStatus }) => void) => void;
		downloadTrackClearHandle: () => void;
		downloadAlbumClearHandle: () => void;

		getTrack: (TrackID: string) => Promise<Track | null>;
		getAlbum: (AlbumID: string) => Promise<Album | null>;

		isAuth: () => Boolean;
		reAuth: () => Promise<Boolean>;

		searchTrack: (search: string) => Promise<Track[] | null>;
		searchAlbum: (search: string) => Promise<Album[] | null>;
		searchArtist: (search: string) => Promise<Artist[] | null>;

		readTrack: (TrackID: string) => Promise<Buffer | Error>;
	};
}