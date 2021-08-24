const { __ } = wp.i18n;
import { fetch as apiFetch } from '../../store/model/controls';
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

export function addPrice( item, index ) {
	return {
		type: 'ADD_PRICE',
		item,
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
export function removePrice( item, index ) {
	return {
		type: 'REMOVE_PRICE',
		item,
		index,
	};
}

export function* save() {
	// is saveable.
	// if ( ! ( yield controls.select( STORE_NAME, 'isEditedPostSaveable' ) ) ) {
	// 	return;
	// }

	// clear any validation errors and set saving
	yield controls.dispatch( UI_STORE_KEY, 'clearValidationErrors' );
	yield controls.dispatch( UI_STORE_KEY, 'setSaving', true );

	let updatedRecord;

	try {
		// save fresh product
		yield saveProduct(
			yield controls.select( 'checkout-engine/product', 'getProduct' )
		);

		// save fresh prices
		yield savePrices(
			yield controls.select( 'checkout-engine/product', 'getPrices' )
		);

		const product = yield controls.select(
			'checkout-engine/product',
			'getProduct'
		);

		const url = wp.url.addQueryArgs( window.location.href, {
			id: product?.id,
		} );
		yield window.history.replaceState(
			{ id: product?.id },
			'Product ' + product?.id,
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

export function* saveProduct( data ) {
	let product;

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

export async function savePrice( data ) {
	let price;

	try {
		price = await apiFetch( {
			path: data.id ? `prices/${ data.id }` : 'prices',
			method: data.id ? 'PATCH' : 'POST',
			data,
		} );
	} catch ( error ) {
		throw error;
	}

	// success.
	if ( price ) {
		await controls.dispatch(
			'checkout-engine/product',
			'updatePrice',
			price
		);
		return price;
	}

	throw {
		message: 'Failed to save.',
	};
}

export async function savePrices( data ) {
	// prepare all prices to save
	let pricesToSave = [];
	data.foreach( ( price ) => {
		const fn = ( _ ) => savePrice( price );
		pricesToSave.push( fn );
	} );

	return Promise.all( pricesToSave );
}
