import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';
import { controls } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Update a promotions attributes.
 */
export function* updateCustomer( payload, index ) {
	return yield controls.dispatch(
		coreStore,
		'updateModel',
		'customers',
		payload,
		index
	);
}
/**
 * Add a coupon
 */
export function* addPromotion( payload, index ) {
	const coupon = yield controls.select( store, 'selectCoupon' );
	return yield controls.dispatch(
		coreStore,
		'addModel',
		'coupons',
		{
			...payload,
			coupon: payload?.coupon || coupon?.id,
			currency: ceData?.currency_code || 'usd',
		},
		index
	);
}

/**
 * Save the page.
 */
export function* save() {
	yield controls.dispatch( uiStore, 'clearErrors' );
	yield controls.dispatch( uiStore, 'setSaving', true );

	try {
		// first save product.
		yield controls.dispatch( coreStore, 'saveModel', 'customers', 0 );

		// update coupon_id in promotions
		const coupon = yield controls.resolveSelect( store, 'selectCoupon' );
		yield controls.dispatch(
			coreStore,
			'updateModelsProperty',
			'promotions',
			'coupon_id',
			coupon?.id
		);

		// add notice.
		yield controls.dispatch( uiStore, 'addSnackbarNotice', {
			content: __( 'Saved.', 'checkout_engine' ),
		} );
	} catch ( error ) {
		yield controls.dispatch( uiStore, 'addSnackbarNotice', {
			className: 'is-snackbar-error',
			content:
				error?.message || __( 'Failed to save.', 'checkout_engine' ),
		} );
		console.error( error );
	} finally {
		yield controls.dispatch( uiStore, 'setSaving', false );
	}
}
