import { combineReducers } from '@wordpress/data';

// Store based on nested key. (i.e. product.price)
export const entities = (
	state = {
		products: {},
		prices: {},
	},
	{ type, payload }
) => {
	switch ( type ) {
		case 'SET_ENTITIES':
			return payload;
		case 'MERGE_ENTITIES':
			return {
				products: {
					...state.products,
					...( payload.products || {} ),
				},
				prices: {
					...state.prices,
					...( payload.prices || {} ),
				},
			};
	}
	return state;
};

export default combineReducers( {
	entities,
} );
