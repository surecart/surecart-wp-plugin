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
		case 'UPDATE_DATA_ITEM':
			return {
				...state,
				data: (state.data || []).map((item) => {
					const { id, ...data } = action.payload;
					if (item.id !== id) {
						return item;
					}
					return {
						...item,
						...data,
					};
				}),
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
