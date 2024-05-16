/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

// controls the product page.
const { state, callbacks, actions } = store('surecart/cart', {
	state: {
		open: false, // is sidebar open or not.
		discountInputOpen: false,
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
		get isDiscountAdded() {
			return false;
			// return !!state.checkout.discount.promotion.code;
		},
	},

	actions: {
		setOpen(open) {
			state.open = open;
		},
		toggleDiscountInput() {
			alert('clicked on actions');
			state.discountInputOpen = !state.discountInputOpen;
		},
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

console.log('state', state);
console.log('state.isDiscountAdded', state.isDiscountAdded);
