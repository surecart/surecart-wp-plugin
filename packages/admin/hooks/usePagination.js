export default ({ data, perPage, page = 1 }) => {
	return {
		hasPrevious: page !== 1,
		hasNext: data?.length && data?.length === perPage,
		hasPagination: page > 1 || data?.length >= perPage,
	};
};
