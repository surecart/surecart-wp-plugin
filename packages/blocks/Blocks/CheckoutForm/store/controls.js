import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

export const fetch = ( options = {} ) => {
	return {
		type: 'FETCH_FROM_API',
		options,
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
};
