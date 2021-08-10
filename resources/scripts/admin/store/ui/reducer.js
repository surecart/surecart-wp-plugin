export default ( state = { saving: false, flash: {} }, action ) => {
	switch ( action.type ) {
		case 'SET_SAVING':
			return {
				...state,
				saving: action.value,
			};
		case 'SET_FLASH':
			return {
				...state,
				flash: action.value,
			};
	}
	return state;
};
