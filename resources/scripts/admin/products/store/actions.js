const { __ } = wp.i18n;
import { fetch as apiFetch, savePrices } from '../../store/model/controls';
const { controls } = wp.data;
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
import { STORE_KEY as NOTICES_STORE_KEY } from '../../store/notices';

export function setProduct( value ) {
	return {
		type: 'SET_PRODUCT',
		value,
	};
}

export function updateProduct( value ) {
	return {
		type: 'UPDATE_PRODUCT',
		value,
	};
}

/**
 * Add a price to the list of prices.
 */
export function* addPrice( item, index ) {
	const product = yield controls.select(
		'checkout-engine/product',
		'getProduct'
	);

	// also add sensible defaults.
	return {
		type: 'ADD_PRICE',
		item: {
			...item,
			product_id: item.product_id || product?.id,
			recurring_interval: item.recurring_interval || 'year',
			recurring_interval_count: item.recurring_interval_count || 1,
		},
		index,
	};
}
export function updatePrice( item, index ) {
	return {
		type: 'UPDATE_PRICE',
		item,
		index,
	};
}
export function updatePrices( item ) {
	return {
		type: 'UPDATE_PRICES',
		item,
	};
}
export function removePrice( item, index ) {
	return {
		type: 'REMOVE_PRICE',
		item,
		index,
	};
}

export function* duplicatePrice( price ) {
	const prices = yield controls.select(
		'checkout-engine/product',
		'getPrices'
	);
	return yield addPrice(
		{
			...price,
			name: sprintf(
				__( '%s (Duplicate)', 'checkout_engine' ),
				price.name
			),
			id: null,
		},
		prices.length
	);
}

export function* save() {
	// is saveable.
	// if ( ! ( yield controls.select( STORE_NAME, 'isEditedPostSaveable' ) ) ) {
	// 	return;
	// }

	// clear any validation errors and set saving
	yield controls.dispatch( UI_STORE_KEY, 'clearValidationErrors' );
	yield controls.dispatch( UI_STORE_KEY, 'setSaving', true );

	try {
		yield saveProduct(
			yield controls.select( 'checkout-engine/product', 'getProduct' )
		);

		// make sure product id is in price.
		const product = yield controls.select(
			'checkout-engine/product',
			'getProduct'
		);
		// update id relationship in prices.
		yield updatePrices( { product_id: product.id } );

		yield savePrices(
			yield controls.select( 'checkout-engine/product', 'getPrices' )
		);

		const url = wp.url.addQueryArgs( window.location.href, {
			id: product?.id,
		} );
		yield window.history.replaceState(
			{ id: product?.id },
			'Product ' + product?.id,
			url
		);

		// add notice.
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
}

export function* saveProduct() {
	let product;

	// get fresh data.
	const data = yield controls.select(
		'checkout-engine/product',
		'getProduct'
	);

	try {
		product = yield apiFetch( {
			path: data.id ? `products/${ data.id }` : 'products',
			method: data.id ? 'PATCH' : 'POST',
			data,
		} );
	} catch ( error ) {
		throw error;
	}

	// success.
	if ( product ) {
		yield controls.dispatch(
			'checkout-engine/product',
			'updateProduct',
			product
		);
		return product;
	}

	// didn't update.
	throw {
		message: 'Failed to save.',
	};
}

export function* deletePrice( price, index ) {
	// unsaved, just remove
	if ( ! price.id ) {
		yield controls.dispatch(
			'checkout-engine/product',
			'removePrice',
			price,
			index
		);
		return;
	}

	yield controls.dispatch( UI_STORE_KEY, 'setSaving', true );

	let response;

	try {
		response = yield apiFetch( {
			path: `prices/${ price.id }`,
			method: 'DELETE',
		} );
		// success.
		if ( response?.deleted ) {
			yield controls.dispatch(
				'checkout-engine/product',
				'removePrice',
				price,
				index
			);
			return price;
		}

		// add notice.
		yield controls.dispatch( NOTICES_STORE_KEY, 'addSnackbarNotice', {
			content: __( 'Deleted.', 'checkout_engine' ),
		} );
	} catch ( error ) {
		throw error;
	} finally {
		yield controls.dispatch( UI_STORE_KEY, 'setSaving', false );
	}

	throw {
		message: 'Failed to delete.',
	};
}
