/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
import {
	updateCheckoutLineItem,
	removeCheckoutLineItem,
	handleCouponApply,
} from '@surecart/checkout-actions';

const LOCAL_STORAGE_KEY = 'surecart-local-storage';

const getCheckoutData = (mode = 'live', formId) => {
	const checkoutData = localStorage.getItem(LOCAL_STORAGE_KEY);

	const parsedCheckoutData = JSON.parse(checkoutData) || {
		live: {},
		test: {},
	};

	const modeData = parsedCheckoutData[mode];

	return modeData?.[formId] || null;
};

// controls the product page.
const { state, callbacks, actions } = store('surecart/checkout', {
	state: {
		openCartSidebar: false,
		loading: false,
		discountCode: '',
		checkout: null,
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
		get discountAmount() {
			return state?.checkout?.discount_amount || 0;
		},
		get hasBumpAmount() {
			return !!state?.checkout?.bump_amount;
		},
		get isCartOpen() {
			return !!state.openCartSidebar;
		},
		get checkoutLineItems() {
			return state.checkout?.line_items?.data || [];
		},
		get hasLineItemImageUrl() {
			const { line_item } = getContext();
			return !!line_item?.price?.product?.image_url;
		},
		get hasSubscription() {
			return (state.checkout?.line_items?.data || []).some(
				(lineItem) =>
					lineItem?.price?.recurring_interval === 'month' &&
					!!lineItem?.price?.recurring_interval &&
					!lineItem?.price?.recurring_period_count
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

		init() {
			const { mode, formId } = getContext();
			const checkout = getCheckoutData(mode, formId);

			if (!checkout) {
				return;
			}

			state.checkout = checkout;
		},
	},

	actions: {
		toggleCartSidebar(e) {
			e.preventDefault();
			state.openCartSidebar = !state?.openCartSidebar || false;

			// Toggle the sc-drawer dialog.
			const { actions } = store('surecart/dialog');
			actions.toggle();
		},
		toggleDiscountInput(e) {
			e.preventDefault();
			const context = getContext();
			context.discountInputOpen = !context.discountInputOpen;
		},
		setDiscountCode(e) {
			state.discountCode = e?.target?.value || '';
		},
		applyDiscount: async () => {
			state.loading = true;
			const checkout = await handleCouponApply(
				state.checkout.id,
				state.discountCode
			);
			state.loading = false;

			if (checkout) {
				state.checkout = checkout;
			}
		},
		closeCouponOnClickOutside: (e) => {
			const context = getContext();

			// if the click is inside the coupon form, do nothing
			if (e && e.target.closest('.sc-coupon-form')) return;

			if (!context.discountInputOpen) return;

			context.discountInputOpen = false;
		},
		setCheckout(data, mode, formId) {
			let checkout = getCheckoutData(mode, formId);

			if (!checkout) {
				return;
			}

			// Set the checkout data.
			state.checkout = data;

			// Find the checkout by mode and formId.
			const checkoutData = checkout[mode]?.[formId];
			let checkoutStorage = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_KEY)
			);

			if (checkoutData) {
				// update the existing checkout data.
				checkoutStorage = {
					...checkoutStorage,
					[mode]: {
						...checkoutStorage[mode],
						[formId]: data,
					},
				};
			} else {
				// create a new checkout data.
				checkoutStorage = {
					...checkoutStorage,
					[mode]: {
						...checkoutStorage[mode],
						[formId]: data,
					},
				};
			}

			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify(checkoutStorage)
			);
		},

		onQuantityIncrease: () => {
			const { line_item } = getContext();
			const quantity = line_item?.quantity + 1;
			actions.updateLineItem({ quantity });
		},

		onQuantityDecrease: () => {
			const { line_item } = getContext();
			const quantity = line_item?.quantity - 1;
			if (quantity < 1) {
				return;
			}
			actions.updateLineItem({ quantity });
		},

		onQuantityChange: (e) => {
			const quantity = parseInt(e.target.value || '');
			actions.updateLineItem({ quantity });
		},

		updateLineItem: async (data) => {
			state.loading = true;
			const { line_item, mode, formId } = getContext();
			const checkout = await updateCheckoutLineItem({
				id: line_item?.id,
				data,
			});

			if (checkout) {
				actions.setCheckout(checkout, mode, formId);
			}
			state.loading = false;
		},

		removeLineItem: async () => {
			state.loading = true;
			const { line_item, mode, formId } = getContext();
			const checkout = await removeCheckoutLineItem(line_item?.id);

			if (checkout) {
				actions.setCheckout(checkout, mode, formId);
			}
			state.loading = false;
		},
	},
});

console.log('state.checkout', state.checkout);
