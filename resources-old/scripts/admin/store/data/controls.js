import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { dispatch } from '@wordpress/data';
import { store as dataStore } from '../data';
import { store as uiStore } from '../ui';

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
				try {
					const updated = await fetchFromAPI( request );
					if ( updated && updated?.id ) {
						await dispatch( dataStore ).updateModel(
							key,
							updated,
							index
						);
						await dispatch( dataStore ).removeDirty( key, index );
					}
				} catch ( error ) {
					// add validation error.
					if ( error?.message ) {
						dispatch( uiStore ).addErrors( [
							{
								index,
								key,
								index,
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
