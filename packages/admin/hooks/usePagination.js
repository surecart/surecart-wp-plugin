export default ({ data, perPage, page = 1, totalItems = null }) => {
	data = data || [];

	const hasNext = totalItems
		? page * perPage < totalItems
		: data?.length === perPage;

	const hasPagination = page > 1 || hasNext;

	return {
		hasPrevious: page !== 1,
		hasNext,
		hasPagination,
	};
};
