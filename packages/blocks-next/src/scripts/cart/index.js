/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

// controls the product page.
const { state, callbacks, actions } = store('surecart/cart', {
	state: {
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
			return !!state?.checkout?.discount?.promotion?.code;
		},
		get isDiscountCodeSet() {
			return !!state?.discountCode;
		},
		get hasBumpAmount() {
			return !!state?.checkout?.bump_amount;
		},
	},

	// actions: {
	// 	*onFetchCheckout() {
	// 		// state.checkout = yield apiFetch({
	// 		// 	method: 'GET',
	// 		// 	path: addQueryArgs(`${baseUrl}${checkoutState.checkout?.id}`, {
	// 		// 		expand,
	// 		// 	}),
	// 		// });
	// 	},
	// },

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

	actions: {
		setOpen(e) {
			e.preventDefault();
			const context = getContext();
			context.open = !context.open;
		},
		toggleDiscountInput(e) {
			e.preventDefault();
			const context = getContext();
			context.discountInputOpen = !context.discountInputOpen;
		},
		setDiscountCode(e) {
			state.discountCode = e?.target?.value || '';
		},
		applyDiscount() {
			console.log('applying discount');
		},
		closeCouponOnClickOutside: (e) => {
			const context = getContext();

			// if the click is inside the coupon form, do nothing
			if (e && e.target.closest('.sc-coupon-form')) return;

			if (!context.discountInputOpen) return;

			context.discountInputOpen = false;
		},
	},
});
