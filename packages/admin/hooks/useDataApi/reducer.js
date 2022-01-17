export default (state, action) => {
	switch (action.type) {
		case 'FETCH_INIT':
			return {
				...state,
				isLoading: true,
				error: '',
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				error: '',
				data: action.payload,
				pagination: action.pagination,
			};
		case 'FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		default:
			throw new Error();
	}
};
