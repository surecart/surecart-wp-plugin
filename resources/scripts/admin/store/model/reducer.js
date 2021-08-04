export default ( state = {}, action ) => {
	switch ( action.type ) {
		case 'SET_MODEL':
			return action.value;
		case 'UPDATE_MODEL':
			return { ...state, ...action.value };
	}
	return state;
};
