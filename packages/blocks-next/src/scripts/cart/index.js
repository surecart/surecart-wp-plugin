/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

// controls the product page.
const { state, callbacks, actions } = store('surecart/cart', {
	state: {
		get checkout() {
			return callbacks.getState('checkout');
		},
	},

	actions: {
		//
	},

	callbacks: {
		/** Get the contextual state. */
		getState(prop) {
			return getContext() || false;
		},
	},
});
