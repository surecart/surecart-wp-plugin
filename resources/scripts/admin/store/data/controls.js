import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { dispatch } from '@wordpress/data';
import { STORE_KEY as DATA_STORE_KEY } from '../data';

export const fetch = ( options = {} ) => {
	return {
		type: 'FETCH_FROM_API',
		options,
	};
};
export const batchSave = ( batches ) => {
	return {
		type: 'BATCH_SAVE',
		batches,
	};
};

/**
 * Wrapper for API to add our endpoint
 */
const fetchFromAPI = ( options ) => {
	const { path, query, ...fetchOptions } = options;
	return apiFetch( {
		...( fetchOptions || {} ),
		path: addQueryArgs( `checkout-engine/v1/${ path }`, query ),
	} );
};

export default {
	async FETCH_FROM_API( { options } ) {
		return await fetchFromAPI( options );
	},
	async BATCH_SAVE( { batches } ) {
		return await Promise.all(
			batches.map( async ( { key, request, index = null } ) => {
				const updated = await fetchFromAPI( request );
				if ( updated ) {
					dispatch( DATA_STORE_KEY ).updateModel(
						`${ key }.${ index }`,
						updated
					);
				}
			} )
		);
	},
};
