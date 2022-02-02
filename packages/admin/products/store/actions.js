import { __ } from '@wordpress/i18n';
import { controls } from '@wordpress/data';
import { store as uiStore } from '../../store/ui';
import { store as coreStore } from '../../store/data';
import { store } from '../store';

/**
 * Update the product's attributes.
 */
export function* updateProduct(payload, index) {
	return yield controls.dispatch(
		coreStore,
		'updateModel',
		'products',
		payload,
		index
	);
}

/**
 * Toggle the product's visibility.
 */
export function* toggleProductArchive(index) {
	yield controls.dispatch(uiStore, 'setSaving', true);
	try {
		yield controls.dispatch(
			coreStore,
			'toggleArchiveModel',
			'products',
			index
		);
		// add notice.
		yield controls.dispatch(uiStore, 'addSnackbarNotice', {
			content: __('Saved.', 'checkout_engine'),
		});
	} catch (e) {
		yield controls.dispatch(uiStore, 'addSnackbarNotice', {
			className: 'is-snackbar-error',
			content: error?.message || __('Failed to save.', 'checkout_engine'),
		});
		console.error(error);
	} finally {
		yield controls.dispatch(uiStore, 'setSaving', false);
	}
}

/**
 * Toggle the product's visibility.
 */
export function* togglePriceArchive(index) {
	yield controls.dispatch(uiStore, 'setSaving', true);
	try {
		yield controls.dispatch(
			coreStore,
			'toggleArchiveModel',
			'prices',
			index
		);
		// add notice.
		yield controls.dispatch(uiStore, 'addSnackbarNotice', {
			content: __('Saved.', 'checkout_engine'),
		});
	} catch (e) {
		yield controls.dispatch(uiStore, 'addSnackbarNotice', {
			className: 'is-snackbar-error',
			content: error?.message || __('Failed to save.', 'checkout_engine'),
		});
		console.error(error);
	} finally {
		yield controls.dispatch(uiStore, 'setSaving', false);
	}
}

/**
 * Update a specific price.
 */
export function* updatePrice(index, payload) {
	// cannot use ad_hoc with recurring.
	if (payload?.recurring) {
		payload.ad_hoc = false;
	}

	return yield controls.dispatch(
		coreStore,
		'updateModel',
		'prices',
		payload,
		index
	);
}

/**
 * Add a new empty price.
 */
export function* addEmptyPrice() {
	return yield controls.dispatch(coreStore, 'addModel', 'prices', {
		currency: ceData?.currency_code || 'usd',
		recurring_interval_count: 1,
		recurring_interval: 'month',
	});
}

/**
 * Add a price.
 */
export function* addPrice(payload, index) {
	const product = yield controls.select(store, 'selectProduct');
	return yield controls.dispatch(
		coreStore,
		'addModel',
		'prices',
		{
			...payload,
			object: 'price',
			currency: ceData?.currency_code || 'usd',
			product_id: payload?.product_id || product?.id,
			recurring_interval: payload.recurring_interval || 'year',
			recurring_interval_count: payload.recurring_interval_count || 1,
		},
		index
	);
}

/**
 * Save the page.
 */
export function* save() {
	yield controls.dispatch(uiStore, 'clearErrors');
	yield controls.dispatch(uiStore, 'setSaving', true);

	try {
		// first save product.
		yield controls.dispatch(coreStore, 'saveModel', 'products', 0);

		// update product_id in prices.
		const product = yield controls.resolveSelect(store, 'selectProduct');
		yield controls.dispatch(
			coreStore,
			'updateModelsProperty',
			'prices',
			'product_id',
			product?.id
		);

		// then batch save prices.
		yield controls.dispatch(coreStore, 'saveCollections', ['prices']);

		// add notice.
		yield controls.dispatch(uiStore, 'addSnackbarNotice', {
			content: __('Saved.', 'checkout_engine'),
		});
	} catch (error) {
		yield controls.dispatch(uiStore, 'addSnackbarNotice', {
			className: 'is-snackbar-error',
			content: error?.message || __('Failed to save.', 'checkout_engine'),
		});
		console.error(error);
	} finally {
		yield controls.dispatch(uiStore, 'setSaving', false);
	}
}
