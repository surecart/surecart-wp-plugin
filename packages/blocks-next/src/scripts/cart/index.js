/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

// controls the product page.
const { state, callbacks, actions } = store('surecart/cart', {
	state: {
		open: false, // is sidebar open or not.
		get getItemsCount() {
			console.log(
				'state.checkout?.line_items?.data',
				state.checkout?.line_items?.data
			);
			return (state.checkout?.line_items?.data || []).reduce(
				(count, item) => count + (item?.quantity || 0),
				0
			);
		},
	},

	actions: {
		//
	},

	callbacks: {
		getState(prop = null) {
			if (prop === null) {
				return getContext();
			}

			return getContext()?.[prop] || false;
		},
		fetchCheckouts() {
			console.log('fetching checkouts');
		},
	},
});
