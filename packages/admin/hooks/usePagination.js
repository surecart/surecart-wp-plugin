export default ({ data, perPage, page = 1 }) => {
	return {
		hasPrevious: page !== 1,
		hasNext: data?.length,
		hasPagination: page > 1 || data?.length >= perPage,
	};
};
