const { combineReducers } = wp.data;

const promotion = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'SET_PROMOTION':
			return action.value;
		case 'UPDATE_PROMOTION':
			return { ...state, ...action.value };
		case 'UPDATE_COUPON':
			return {
				...state,
				coupon: {
					...( state.coupon || {} ),
					...action.value,
				},
			};
	}
	return state;
};

export default combineReducers( {
	promotion,
} );
