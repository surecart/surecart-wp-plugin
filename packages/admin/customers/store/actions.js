import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';
import { controls } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Update a promotions attributes.
 */
export function* updateCustomer(payload, index) {
	return yield controls.dispatch(
		coreStore,
		'updateModel',
		'customers',
		payload,
		index
	);
}

export function setUser(payload) {
	return {
		type: 'SET_USER',
		payload,
	};
}

export function disconnectUser(payload) {
	return {
		type: 'DISCONNECT_USER',
		payload,
	};
}

/**
 * Save the page.
 */
export function* save() {
	yield controls.dispatch(uiStore, 'clearErrors');
	yield controls.dispatch(uiStore, 'setSaving', true);

	try {
		// first save customer
		yield controls.dispatch(coreStore, 'saveModel', 'customers', 0);

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
