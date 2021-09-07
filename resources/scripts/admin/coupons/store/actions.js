const { __ } = wp.i18n;
import { fetch as apiFetch } from '../../store/data/controls';
const { controls } = wp.data;
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
import { STORE_KEY as NOTICES_STORE_KEY } from '../../store/notices';

export function setPromotion( value ) {
	return {
		type: 'SET_PROMOTION',
		value,
	};
}

export function updatePromotion( value ) {
	return {
		type: 'UPDATE_PROMOTION',
		value,
	};
}

export function updateCoupon( value ) {
	return {
		type: 'UPDATE_COUPON',
		value,
	};
}

export function* save() {
	// is saveable.
	// if ( ! ( yield controls.select( STORE_NAME, 'isEditedPostSaveable' ) ) ) {
	// 	return;
	// }

	// clear any validation errors and set saving
	yield controls.dispatch( UI_STORE_KEY, 'clearErrors' );
	yield controls.dispatch( UI_STORE_KEY, 'setSaving', true );

	// abstract this for other pages.
	// yield controls.dispatch('checkout-engine/core', 'saveModel', 'coupons', coupon,  'UPDATE_COUPON');
	// yield controls.dispatch('checkout-engine/core', 'saveModel', 'coupons', coupon,  'UPDATE_COUPON');

	let updatedRecord;

	try {
		// save coupon first.
		yield saveCoupon(
			yield controls.select( 'checkout-engine/coupon', 'getCoupon' )
		);

		// save promotion
		yield savePromotion(
			yield controls.select( 'checkout-engine/coupon', 'getPromotion' )
		); // then save promotion.

		const promotion = yield controls.select(
			'checkout-engine/coupon',
			'getPromotion'
		);

		const url = wp.url.addQueryArgs( window.location.href, {
			id: promotion?.id,
		} );
		yield window.history.replaceState(
			{ id: promotion?.id },
			'Promotion ' + promotion?.id,
			url
		);

		// add notice error.
		yield controls.dispatch( NOTICES_STORE_KEY, 'addSnackbarNotice', {
			content: __( 'Saved.', 'checkout_engine' ),
		} );
	} catch ( e ) {
		// log error.
		console.error( e );
		// add notice error.
		yield controls.dispatch( NOTICES_STORE_KEY, 'addSnackbarNotice', {
			className: 'is-snackbar-error',
			content:
				e?.message || __( 'Something went wrong.', 'checkout_engine' ),
		} );
		// add validation error.
		yield controls.dispatch(
			UI_STORE_KEY,
			'addValidationErrors',
			e?.additional_errors || []
		);
	} finally {
		yield controls.dispatch( UI_STORE_KEY, 'setSaving', false );
	}

	return updatedRecord;
}

export function* saveCoupon( data ) {
	let coupon;

	try {
		coupon = yield apiFetch( {
			path: data.id ? `coupons/${ data.id }` : 'coupons',
			method: data.id ? 'PATCH' : 'POST',
			data,
		} );
	} catch ( error ) {
		throw error;
	}

	// success.
	if ( coupon ) {
		yield controls.dispatch(
			'checkout-engine/coupon',
			'updateCoupon',
			coupon
		);
		return coupon;
	}

	// didn't update.
	throw {
		message: 'Failed to save.',
	};
}

export function* savePromotion( data ) {
	let promotion;

	try {
		promotion = yield apiFetch( {
			path: data.id ? `promotions/${ data.id }` : 'promotions',
			method: data.id ? 'PATCH' : 'POST',
			data,
		} );
	} catch ( error ) {
		throw error;
	}

	// success.
	if ( promotion ) {
		yield controls.dispatch(
			'checkout-engine/coupon',
			'updatePromotion',
			promotion
		);
		return promotion;
	}

	throw {
		message: 'Failed to save.',
	};
}
