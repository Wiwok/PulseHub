export default function toReadableDuration(ms: number) {
	console.log(ms);
	if (isNaN(ms)) {
		return `--:--`;
	}
	const seconds = parseInt((ms / 1_000).toFixed(0));
	const minutes = parseInt((seconds / 60).toFixed(0));
	const hours = parseInt((minutes / 60).toFixed(0));

	if (minutes > 0) {
		if (hours > 0) {
			return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
		}
		return `${minutes % 60}:${(seconds % 60).toString().padStart(2, '0')}`;
	}
	return `0:${(seconds % 60).toString().padStart(2, '0')}`;
}