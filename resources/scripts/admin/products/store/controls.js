const { apiFetch } = wp;
const { dispatch } = wp.data;

export const savePrices = ( prices = [] ) => {
	return {
		type: 'SAVE_PRICES',
		prices,
	};
};

export default {
	async SAVE_PRICES( { prices } ) {
		return await Promise.all(
			prices.map( async ( data, index ) => {
				const updated = await apiFetch( {
					path: data.id
						? `checkout-engine/v1/prices/${ data.id }`
						: 'checkout-engine/v1/prices',
					method: data.id ? 'PATCH' : 'POST',
					data,
				} );
				dispatch( 'checkout-engine/product' ).updatePrice(
					updated,
					index
				);
			} )
		);
	},
};
