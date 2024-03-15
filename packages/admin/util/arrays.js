export function paginate(array, size, pageNumber) {
	const data = array.reduce((acc, val, i) => {
		let idx = Math.floor(i / size);
		let page = acc[idx] || (acc[idx] = []);
		page.push(val);

		return acc;
	}, []);

	return {
		data: data[pageNumber - 1] || [],
		total: array.length,
		totalPages: data.length,
	};
}
