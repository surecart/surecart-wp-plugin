export default ( state = [], action ) => {
	switch ( action.type ) {
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
			return state.filter( ( notice ) => notice.id !== action.id );
	}
	return state;
};
