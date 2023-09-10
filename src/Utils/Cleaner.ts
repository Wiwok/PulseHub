function toReadableDuration(time: number) {
	if (isNaN(time)) {
		return `--:--`;
	}

	time = Math.floor(time);

	const seconds = time % 60;
	const minutes = Math.floor(time / 60);
	const hours = Math.floor(minutes / 60);

	if (minutes > 0) {
		if (hours > 0) {
			return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
		}
		return `${minutes % 60}:${(seconds % 60).toString().padStart(2, '0')}`;
	}
	return `0:${(seconds % 60).toString().padStart(2, '0')}`;
}

function toReadableArtists(artists: any[]) {
	let text = '';
	artists.forEach((el, i) => {
		if (i == 0)
			text += el.name;
		else
			text += ', ' + el.name;
	});
	return text;
}

export { toReadableDuration, toReadableArtists };