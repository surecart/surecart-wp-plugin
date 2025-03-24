/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
const { __ } = wp.i18n;

const { state, actions } = store('surecart/product-quick-view', {
	state: {
		isOpen: false,
		productId: null,
	},

	actions: {
		*productQuickView(e) {
			e.preventDefault();
			const { productId } = getContext();
			console.log('productId', productId);

			state.isOpen = true;
			state.productId = productId;
		},
	},
});
