export default (
	state = { isSaving: false, flash: {}, validation: [] },
	action
) => {
	switch ( action.type ) {
		case 'SET_SAVING':
			return {
				...state,
				isSaving: action.value,
			};
		case 'SET_FLASH':
			return {
				...state,
				flash: action.value,
			};
		case 'ADD_VALIDATION_ERRORS':
			return {
				...state,
				validation: [ ...state.validation, ...action.value ],
			};
		case 'CLEAR_VALIDATION_ERRORS':
			if ( action.attribute ) {
				return {
					...state,
					validation: state.validation.filter(
						( item ) => item?.data?.attribute !== action.attribute
					),
				};
			}
			return {
				...state,
				validation: [],
			};
	}
	return state;
};
