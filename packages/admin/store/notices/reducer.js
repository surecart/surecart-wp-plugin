export default (state = [], action) => {
	switch (action.type) {
		case 'ADD_SNACKBAR_NOTICE':
			return [
				...state,
				{
					id: state.length,
					className:
						action?.notice?.type === 'error'
							? 'is-snackbar-error'
							: '',
					...action.notice,
				},
			];
		case 'REMOVE_SNACKBAR_NOTICE':
			return state.filter((notice) => notice.id !== action.id);
		case 'SAVE_ERROR':
			return [
				...state,
				{
					id: state.length,
					className: 'is-snackbar-error',
					content:
						action?.message ||
						__('Something went wrong.', 'surecart'),
				},
			];
	}
	return state;
};
