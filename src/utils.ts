function cleanTime(time: number) {
	const seconds = (time % 60).toString().padStart(2, '0');
	const minutes = Math.floor(time / 60)
		.toString()
		.padStart(2, '0');
	return minutes + ':' + seconds;
}

export { cleanTime };
