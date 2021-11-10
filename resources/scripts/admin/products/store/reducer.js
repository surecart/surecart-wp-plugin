import { combineReducers } from '@wordpress/data';
import {
	entities as modelEntities,
	dirty,
	error,
} from '../../store/data/reducer';

// set default model state.
export const entities = (
	state = {
		prices: [
			{
				object: 'price',
				name: 'Default',
				recurring_interval: 'year',
				recurring_interval_count: 1,
			},
		],
		products: [],
	},
	args
) => {
	const { type, key, payload } = args;

	// update product id in prices when product is updated
	if ( type === 'UPDATE_MODEL' && key === 'products.0' && payload?.id ) {
		return {
			...state,
			...modelEntities( state, args ),
			prices: state.prices.map( ( price ) => {
				return {
					...price,
					product_id: price.product_id || payload.id,
				};
			} ),
		};
	}

	return modelEntities( state, args );
};

// export reducers.
export default combineReducers( {
	error,
	entities,
	dirty,
} );
