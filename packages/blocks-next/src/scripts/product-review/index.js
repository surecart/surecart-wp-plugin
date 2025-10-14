/**
 * WordPress dependencies.
 */
import { store } from '@wordpress/interactivity';

// controls the product page.
const { state, actions } = store('surecart/product-review', {
	state: {
		loading: false,
		open: false,
	},

	actions: {
	},

	callbacks: {
		*init() {
			//
		},
		handleSubmit() {
			// console.log('handleSubmit');
			// prevent the form submission.
			return false;
		},
	},
});
