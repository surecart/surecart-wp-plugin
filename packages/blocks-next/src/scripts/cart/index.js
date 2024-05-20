/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

// controls the product page.
const { state, callbacks, actions } = store('surecart/cart', {
	state: {
		open: false, // is sidebar open or not.
		discountInputOpen: false,
		discountCode: '',
		get getItemsCount() {
			return (state.checkout?.line_items?.data || []).reduce(
				(count, item) => count + (item?.quantity || 0),
				0
			);
		},
		get discountIsRedeemable() {
			return (
				state?.checkout?.discount?.redeemable_status === 'redeemable'
			);
		},
		get lineItemHasScratchAmount() {
			const { line_item } = getContext();
			return line_item.price.scratchAmount !== line_item.price.amount;
		},
		get isDiscountAdded() {
			return !!state.checkout?.discount?.promotion?.code;
		},
		get isDiscountCodeSet() {
			return !!state?.discountCode;
		},
	},

	actions: {
		*onFetchCheckout() {
			// state.checkout = yield apiFetch({
			// 	method: 'GET',
			// 	path: addQueryArgs(`${baseUrl}${checkoutState.checkout?.id}`, {
			// 		expand,
			// 	}),
			// });
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
		setOpen(open) {
			state.open = open;
		},
		toggleDiscountInput(e) {
			state.discountInputOpen = !state.discountInputOpen;
		},
		setDiscountCode(e) {
			state.discountCode = e?.target?.value || '';
		},
		applyDiscount() {
			console.log('applying discount');
		},
	},
});

console.log('state', state);
console.log('state.discountInputOpen', state.discountInputOpen);
