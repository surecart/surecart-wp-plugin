const { apiFetch } = wp;
const { dispatch } = wp.data;
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
import { STORE_KEY as PRODUCT_STORE_KEY } from '../store';

export const savePrices = ( prices = [] ) => {
	return {
		type: 'SAVE_PRICES',
		prices,
	};
};

export default {
	async SAVE_MODELS( { models } ) {},
	async SAVE_PRICES( { prices } ) {
		return await Promise.all(
			prices.map( async ( data, index ) => {
				try {
					const updated = await apiFetch( {
						path: data.id
							? `checkout-engine/v1/prices/${ data.id }`
							: 'checkout-engine/v1/prices',
						method: data.id ? 'PATCH' : 'POST',
						data,
					} );
					dispatch( PRODUCT_STORE_KEY ).updatePrice( updated, index );
				} catch ( error ) {
					// add validation error.
					if ( error?.message ) {
						dispatch( UI_STORE_KEY ).addErrors( [
							{
								index,
								model: 'price',
								error,
							},
						] );
					}
					throw error;
				}
			} )
		);
	},
};
