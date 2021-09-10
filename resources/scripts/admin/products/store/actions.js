const { __ } = wp.i18n;
const { controls } = wp.data;

import * as modelActions from '../../store/data/actions';
export * from '../../store/data/actions';

import { STORE_KEY } from './index';

/**
 * Set product in store.
 */
export function setEntities( payload ) {
	return modelActions.setEntities( payload );
}

export function setModel( path, payload ) {
	return modelActions.setModel( path, payload );
}

export function updateModel( path, payload ) {
	return modelActions.updateModel( path, payload );
}

/**
 * Update product in store.
 */
export function updateProduct( payload ) {
	return modelActions.updateModel( 'product', payload );
}

/**
 * Add nested price.
 */
export function* addPrice( payload ) {
	const product = yield controls.select( STORE_KEY, 'selectProduct' );

	return modelActions.addModel( 'prices', {
		...payload,
		object: 'price',
		product_id: payload.product_id || product?.id,
		recurring_interval: payload.recurring_interval || 'year',
		recurring_interval_count: payload.recurring_interval_count || 1,
	} );
}

/**
 * Duplicate price. (Alias for Add Price)
 */
export function duplicatePrice( payload ) {
	return addPrice( payload );
}

/**
 * Update nested price.
 */
export function updatePrice( payload, index ) {
	// cannot use ad_hoce with recurring.
	if ( payload?.recurring ) {
		payload.ad_hoc = false;
	}
	return modelActions.updateModel( `prices.${ index }`, payload );
}

export function deletePrice( index ) {
	return modelActions.deleteModel( `prices.${ index }` );
}

export function save() {
	return modelActions.saveModel( 'product', { with: [ 'prices' ] } );
}

export function saveProduct() {
	return modelActions.saveModel( 'product' );
}
