/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

const LOCAL_STORAGE_KEY = 'surecart-local-storage';

// controls the product page.
const { state, callbacks, actions } = store('surecart/checkout', {
	state: {
		openCartSidebar: false,
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
		// get checkout() {
		// 	// context form id and mode.
		// 	// pull from local storage.
		// },
		get checkoutData() {
			// get the checkout data from local storage.
			const mode = getContext('mode');
			const checkoutData = state.checkoutStorage[mode];
			return checkoutData;
		},
	},

	// watch directive.

	// actions: {
	// 	*onFetchCheckout() {
	// 		// state.checkout = yield apiFetch({
	// 		// 	method: 'GET',
	// 		// 	path: addQueryArgs(`${baseUrl}${checkoutState.checkout?.id}`, {
	// 		// 		expand,
	// 		// 	}),
	// 		// });

	// store in local, form id and mode ==> same as how previous
	// 	},
	// },

	actions: {
		setCheckout(data, mode = 'live', formId = null) {
			// set the checkout data to local storage by key.
			const checkoutData = JSON.stringify(data);
			const previousCheckoutData =
				localStorage.getItem(LOCAL_STORAGE_KEY) || {};
			const parsedPreviousCheckoutData = JSON.parse(previousCheckoutData);

			// Store data by mode for live / test.
			const checkoutStorage = {
				...parsedPreviousCheckoutData,
				[mode]: checkoutData,
			};

			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify(checkoutStorage)
			);
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

	actions: {
		toggleCartSidebar(e) {
			console.log('toggling cart sidebar');
			e.preventDefault();
			state.openCartSidebar = !state?.openCartSidebar || false;
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
