const { combineReducers } = wp.data;

const coupon = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'SET_COUPON':
			return action.value;
		case 'UPDATE_COUPON':
			return { ...state, ...action.value };
	}
	return state;
};

const promotions = ( state = [], action ) => {
	switch ( action.type ) {
		case 'SET_PROMOTIONS':
			return action.value;
		case 'UPDATE_PROMOTION':
			return state.map( ( item, index ) => {
				if ( index !== action.index ) {
				}
				return {
					...item,
					...action.item,
				};
			} );
	}
	return state;
};

export default combineReducers( {
	coupon,
	promotions,
} );
