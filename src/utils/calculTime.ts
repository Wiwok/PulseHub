export default function calculTime(ms: number): string {
	if (ms < 60_000 || ms > 86_400_000) {
		return (Math.round(ms / 1000).toString() + 's')
	}
	const seconds = Math.round(ms / 1_000);
	const hours = Math.round(seconds / 3_600);
	const minutes = Math.round((seconds % 3_600) / 60);
	const remainingSeconds = seconds % 60;

	const hoursStr = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
	const minutesStr = minutes > 0 || hours > 0 ? `${minutes.toString().padStart(2, '0')}:` : '';
	const secondsStr = `${remainingSeconds.toString().padStart(2, '0')}`;

	return `${hoursStr}${minutesStr}${secondsStr}`;
}