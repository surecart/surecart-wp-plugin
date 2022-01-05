import { __ } from '@wordpress/i18n';
import { controls } from '@wordpress/data';
import { store as uiStore } from '../../store/ui';
import { store as coreStore } from '../../store/data';
import { store } from '../store';

/**
 * Update a promotions attributes.
 */
export function* updatePromotion( payload, index ) {
	return yield controls.dispatch(
		coreStore,
		'updateModel',
		'promotions',
		payload,
		index
	);
}

/**
 * Update a coupon's attributes.
 */
export function* updateCoupon( payload, index = 0 ) {
	// remove any conflicting strategies
	if ( payload?.amount_off ) {
		payload.percent_off = null;
	}
	if ( payload?.percent_off ) {
		payload.amount_off = null;
	}

	return yield controls.dispatch(
		coreStore,
		'updateModel',
		'coupons',
		payload,
		index
	);
}

/**
 * Add a new empty promo code.
 */
export function* addEmptyPromotion() {
	const coupon = yield controls.select( store, 'selectCoupon' );
	return yield controls.dispatch( coreStore, 'addModel', 'promotions', {
		currency: ceData?.currency_code || 'usd',
		coupon_id: coupon?.id,
	} );
}

/**
 * Toggle the promotions visibility
 */
export function* togglePromotionArchive( index ) {
	yield controls.dispatch( uiStore, 'setSaving', true );
	try {
		yield controls.dispatch(
			coreStore,
			'toggleArchiveModel',
			'promotions',
			index
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

/**
 * Toggle the a coupon's visibility
 */
export function* toggleCouponArchive( index = 0 ) {
	yield controls.dispatch( uiStore, 'setSaving', true );
	try {
		yield controls.dispatch(
			coreStore,
			'toggleArchiveModel',
			'coupons',
			index
		);
		// add notice.
		yield controls.dispatch( uiStore, 'addSnackbarNotice', {
			content: __( 'Saved.', 'checkout_engine' ),
		} );
	} catch ( e ) {
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
		yield controls.dispatch( coreStore, 'saveModel', 'coupons', 0 );

		// update coupon_id in promotions
		const coupon = yield controls.resolveSelect( store, 'selectCoupon' );
		yield controls.dispatch(
			coreStore,
			'updateModelsProperty',
			'promotions',
			'coupon_id',
			coupon?.id
		);

		// then batch save promotions
		yield controls.dispatch( coreStore, 'saveCollections', [
			'promotions',
		] );

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
