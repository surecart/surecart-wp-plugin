/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
import {
	updateCheckoutLineItem,
	removeCheckoutLineItem,
	handleCouponApply,
} from '@surecart/checkout-service';
import { processCheckoutEvents } from '@surecart/checkout-events';

// const { actions: cartDrawerActions } = store('surecart/cart');
const { __, sprintf, _n } = wp.i18n;
const { speak } = wp.a11y;
const LOCAL_STORAGE_KEY = 'surecart-local-storage';

const getCheckoutData = (mode = 'live', formId) => {
	const checkoutData = localStorage.getItem(LOCAL_STORAGE_KEY);
	const defaultData = {
		live: {},
		test: {},
	};

	const parsedCheckoutData = JSON.parse(checkoutData) || defaultData;

	const modeData = parsedCheckoutData[mode];

	return modeData?.[formId] || defaultData;
};

const isNotKeySubmit = (e) => {
	return e.type === 'keydown' && e.key !== 'Enter' && e.code !== 'Space';
};

const moveFocusToElement = (elementSelector) => {
	const element = document.querySelector?.(elementSelector) || null;
	if (element) {
		setTimeout(() => {
			element.focus();
		}, 0);
	}
};

/**
 * Checkout store.
 */
const { state, actions } = store('surecart/checkout', {
	state: {
		loading: false,
		error: null,
		promotionCode: '',
		checkout: {},
		oldCheckout: {},
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
		get lineItemAmountDisplay() {
			const { line_item } = getContext();
			if (!!line_item?.ad_hoc_amount) {
				return line_item.ad_hoc_amount_display;
			}

			return line_item.subtotal_amount_display;
		},
		get lineItemHasScratchAmount() {
			const { line_item } = getContext();
			if (!!line_item?.ad_hoc_amount) {
				return false;
			}

			return line_item.price.scratchAmount !== line_item.price.amount;
		},
		get isDiscountAdded() {
			return !!state?.checkout?.discount?.promotion?.code;
		},
		get isPromotionCodeSet() {
			return !!state?.promotionCode;
		},
		get discountAmount() {
			return state?.checkout?.discount_amount || 0;
		},
		get hasBumpAmount() {
			return !!state?.checkout?.bump_amount;
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

		get isEditable() {
			const { line_item } = getContext();
			if (line_item?.price?.ad_hoc || line_item?.bump_amount) {
				return false;
			}

			return true;
		},

		// Do any line items have a recurring price?
		get hasRecurring() {
			return state?.checkout?.line_items?.data?.some(
				(item) => item?.price?.recurring_interval
			);
		},

		get errorTitle() {
			return state.error?.title || state.error || '';
		},

		get errorMessage() {
			return state.error?.message || '';
		},

		get showCartMenuIcon() {
			const { cartMenuAlwaysShown } = getContext();
			return state.getItemsCount > 0 || cartMenuAlwaysShown;
		},

		get getItemsCountAriaLabelByCount() {
			const count = state.getItemsCount;
			return sprintf(
				_n(
					/* translators: %d: number of items in the cart */
					'Total of %d item in the cart',
					'Total of %d items in the cart',
					count,
					'surecart'
				),
				count
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

		onChangeCheckout() {
			const { checkout, oldCheckout } = state;

			// Trigger events based on the checkout data.
			processCheckoutEvents(checkout, oldCheckout);
		},
	},

	actions: {
		toggleDiscountInput(e) {
			// check if keydown event and not enter/space key.
			if (isNotKeySubmit(e)) {
				return true;
			}

			e.preventDefault();

			const context = getContext();
			context.discountInputOpen = !context.discountInputOpen;

			// focus after the input is visible.
			const { ref } = getElement();
			const input = ref?.parentElement?.querySelector?.('input');
			if (input) {
				setTimeout(() => input.focus(), 0);
			}
		},

		setPromotionCode(e) {
			state.promotionCode = e?.target?.value || '';
		},

		maybeApplyDiscountOnKeyChange(e) {
			if (e.key === 'Escape' || e.key === 'Enter') {
				e.preventDefault();
				e.stopPropagation();
			}

			// if pressed escape key, close the input.
			if (e.key === 'Escape') {
				const context = getContext();
				context.discountInputOpen = false;

				// Move focus back to #sc-coupon-trigger button.
				moveFocusToElement('#sc-coupon-trigger');
				return;
			}

			// if pressed enter key, apply the discount.
			if (e.key === 'Enter') {
				actions.applyDiscount(e);
			}

			// if pressed other keys, set the promotion code.
			actions.setPromotionCode(e);
		},

		applyDiscount: async (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (!state.promotionCode) {
				return;
			}

			const { mode, formId } = getContext();
			const checkout = await handleCouponApply(state.promotionCode);

			if (checkout) {
				if (!checkout?.discount?.coupon) {
					// TODO: Change this from API.
					state.error = {
						title: 'Failed to update. Please check for errors and try again.',
						message: 'This coupon code is invalid.',
					};
					return;
				}

				state.error = '';
				actions.setCheckout(checkout, mode, formId);

				// Move focus back to #sc-coupon-remove-discount button.
				moveFocusToElement('#sc-coupon-remove-discount');
			}
		},

		removeDiscount: async () => {
			const context = getContext();
			const { mode, formId } = context;
			const checkout = await handleCouponApply(null);

			if (checkout) {
				state.promotionCode = '';
				context.discountInputOpen = false;
				actions.setCheckout(checkout, mode, formId);

				// Move focus back to #sc-coupon-trigger button.
				moveFocusToElement('#sc-coupon-trigger');
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

			// Keep the old checkout to track google analytics events.
			state.oldCheckout = checkout;

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

			state.checkout = getCheckoutData(mode, formId);
		},

		onQuantityIncrease: (e) => {
			if (isNotKeySubmit(e)) {
				return true;
			}
			const { line_item } = getContext();
			const quantity = line_item?.quantity + 1;
			actions.updateLineItem({ quantity });
		},

		onQuantityDecrease: (e) => {
			if (isNotKeySubmit(e)) {
				return true;
			}
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
