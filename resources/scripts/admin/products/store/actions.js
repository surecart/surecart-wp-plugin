import { controls } from '@wordpress/data';

import * as modelActions from '../../store/data/actions';
export * from '../../store/data/actions';

import { STORE_KEY } from './index';
import { STORE_KEY as DATA_STORE_KEY } from '../../store/data';

/**
 * Overwrite updateModel action creator to sanitize input
 */
export function updateModel( key, payload, index ) {
	// handle prices
	if ( key === 'prices' ) {
		// cannot use ad_hoc with recurring.
		if ( payload?.recurring ) {
			payload.ad_hoc = false;
		}
	}

	return modelActions.updateModel( key, payload, index );
}

/**
 * Overwrite addModel action creator to sanitize prices.
 */
export function* addModel( path, payload, index ) {
	if ( path === 'prices' ) {
		const product = yield controls.select( STORE_KEY, 'selectProduct' );

		return modelActions.addModel(
			'prices',
			{
				...payload,
				object: 'price',
				product_id: payload.product_id || product?.id,
				recurring_interval: payload.recurring_interval || 'year',
				recurring_interval_count: payload.recurring_interval_count || 1,
			},
			index
		);
	}

	return modelActions.addModel( path, payload );
}

/**
 * Duplicate price. (Alias for Add Price)
 */
export function duplicatePrice( payload ) {
	return addPrice( payload );
}

export function save() {
	return modelActions.saveModel( 'product', { with: [ 'prices' ] } );
}
