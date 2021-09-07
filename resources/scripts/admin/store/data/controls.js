const { apiFetch } = wp;
const { addQueryArgs } = wp.url;
const { dispatch } = wp.data;
const { controls } = wp.data;

export const fetch = ( options = {} ) => {
	return {
		type: 'FETCH_FROM_API',
		options,
	};
};
export const saveModel = async ( key ) => {
	const data = await controls.select(
		'checkout-engine/data',
		'selectModel',
		key
	);
	console.log( { data } );
	return {
		type: 'SAVE_MODEL',
		key,
	};
};

export const batchSave = ( batches ) => {
	return {
		type: 'BATCH_SAVE',
		batches,
	};
};
export const savePrices = ( prices = [] ) => {
	return {
		type: 'SAVE_PRICES',
		prices,
	};
};

export default {
	FETCH_FROM_API( { options } ) {
		const { path, query } = options;
		return apiFetch( {
			...( options || {} ),
			path: addQueryArgs( `checkout-engine/v1/${ path }`, query ),
		} );
	},
	async BATCH_SAVE( { batches } ) {
		return await Promise.all(
			batches.map( async ( { key, request, index = null } ) => {
				const updated = await apiFetch( request );
				console.log( index );
				dispatch( 'checkout-engine/data' ).updateModel(
					`${ key }.${ index }`,
					updated
				);
			} )
		);
	},
	async SAVE_GROUPS( { groups } ) {
		return await Promise.all(
			Object.keys( groups ).map( async ( key ) => {
				const group = groups[ key ];
				group.map( async ( model, index ) => {
					const updated = await apiFetch( {
						path: model.id
							? `checkout-engine/v1/${ model.object }s/${ model.id }`
							: `checkout-engine/v1/${ model.object }s`,
						method: model.id ? 'PATCH' : 'POST',
						model,
					} );
					dispatch( 'checkout-engine/data' ).updateModel(
						key,
						updated,
						index
					);
				} );
			} )
		);
	},
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
