/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

const LOCAL_STORAGE_KEY = 'surecart-local-storage';

const getCheckoutData = (mode = 'live') => {
	const checkoutData = localStorage.getItem(
		LOCAL_STORAGE_KEY
	);

	const parsedCheckoutData = JSON.parse(checkoutData) || {
		live: {},
		test: {},
	};

	return parsedCheckoutData[mode];
};

// controls the product page.
const { state, callbacks, actions } = store('surecart/checkout', {
	state: {
		openCartSidebar: false,
		loading: false,
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
		get isCartOpen () {
			return !!state.openCartSidebar;
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

	callbacks: {
		getState(prop = null) {
			if (prop === null) {
				return getContext();
			}

			return getContext()?.[prop] || false;
		},

		*fetchCheckout(e) {
			// const context = getContext();
			// const { mode } = context;
			// return getCheckoutData(mode);
			e?.preventDefault();

			state.loading = true;
			const context = getContext();

			const { mode } = context;

			const checkoutData = yield getCheckoutData(mode);
		},
	},

	actions: {
		toggleCartSidebar(e) {
			console.log('toggling cart sidebar');
			e.preventDefault();
			state.openCartSidebar = !state?.openCartSidebar || false;
		},
		toggleDiscountInput(e) {
			console.log('toggling discount input.');
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
		setCheckout(data, mode = 'live') {
			const previousCheckoutData = localStorage.getItem(
				LOCAL_STORAGE_KEY
			) || {
				live: {},
				test: {},
			};

			// set the checkout data to local storage by key.
			const checkoutData = JSON.stringify(data);
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
});
