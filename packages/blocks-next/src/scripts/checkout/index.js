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

/**
 * Get checkout data from local storage based on mode and formId.
 */
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

/**
 * Check if the key is not submit key.
 */
const isNotKeySubmit = (e) => {
	return e.type === 'keydown' && e.key !== 'Enter' && e.code !== 'Space';
};

/**
 * Move focus to the selected element.
 */
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
		/**
		 * Checkout loading state.
		 */
		loading: false,

		/**
		 * Checkout error.
		 */
		error: null,

		/**
		 * Applied promotion code.
		 */
		promotionCode: '',

		/**
		 * Current checkout data.
		 */
		checkout: {},

		/**
		 * Old checkout data.
		 */
		oldCheckout: {},

		/**
		 * Get the number of items in checkout.
		 */
		get itemsCount() {
			return (state.checkout?.line_items?.data || []).reduce(
				(count, item) => count + (item?.quantity || 0),
				0
			);
		},

		/**
		 * Check if the checkout has any line items.
		 */
		get hasItems() {
			return state.itemsCount > 0;
		},

		/**
		 * Check if the discount is redeemable.
		 */
		get discountIsRedeemable() {
			return (
				state?.checkout?.discount?.redeemable_status === 'redeemable'
			);
		},

		/**
		 * Get the line item display amount.
		 */
		get lineItemDisplayAmount() {
			const { line_item } = getContext();
			if (!!line_item?.ad_hoc_amount) {
				return line_item.ad_hoc_display_amount;
			}

			return line_item.subtotal_display_amount;
		},

		/**
		 * Check if the current line item has a scratch amount.
		 */
		get lineItemHasScratchAmount() {
			const { line_item } = getContext();
			if (!!line_item?.ad_hoc_amount) {
				return false;
			}

			return line_item.price.scratchAmount !== line_item.price.amount;
		},

		/**
		 * Check if the discount is applied to the cart/checkout.
		 */
		get isDiscountApplied() {
			return !!state?.checkout?.discount?.promotion?.code;
		},

		/**
		 * Check if the promotion code is set on cart/checkout.
		 */
		get isPromotionCodeSet() {
			return !!state?.promotionCode;
		},

		/**
		 * Get the checkout discount amount.
		 */
		get discountAmount() {
			return state?.checkout?.discount_amount || 0;
		},

		/**
		 * Check if the checkout has a bump amount.
		 */
		get hasBumpAmount() {
			return !!state?.checkout?.bump_amount;
		},

		/**
		 * Get the checkout line items.
		 */
		get checkoutLineItems() {
			return state.checkout?.line_items?.data || [];
		},

		/**
		 * Check if the line item has an image URL.
		 */
		get hasLineItemImageUrl() {
			const { line_item } = getContext();
			return !!line_item?.price?.product?.image_url;
		},

		/**
		 * Check if the line item is editable.
		 */
		get isEditable() {
			const { line_item } = getContext();
			return line_item?.price?.ad_hoc || line_item?.bump_amount
				? false
				: true;
		},

		/**
		 * Check if the checkout has a subscription line item.
		 */
		get hasSubscription() {
			return (state.checkout?.line_items?.data || []).some(
				(lineItem) =>
					lineItem?.price?.recurring_interval === 'month' &&
					!!lineItem?.price?.recurring_interval &&
					!lineItem?.price?.recurring_period_count
			);
		},

		/**
		 * Check if any line items have a recurring price.
		 */
		get hasRecurring() {
			return state?.checkout?.line_items?.data?.some(
				(item) => item?.price?.recurring_interval
			);
		},

		/**
		 * Get the cart/checkout error title.
		 */
		get errorTitle() {
			return state.error?.title || state.error || '';
		},

		/**
		 * Get the cart/checkout error message.
		 */
		get errorMessage() {
			return state.error?.message || '';
		},

		/**
		 * Get the cart menu icon visibility.
		 */
		get showCartMenuIcon() {
			const { cartMenuAlwaysShown } = getContext();
			return state.itemsCount > 0 || cartMenuAlwaysShown;
		},

		/**
		 * Get the aria label for the cart icon count.
		 */
		get itemsCountAriaLabel() {
			const count = state.itemsCount;
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

		/**
		 * Is the current checkout an installment checkout?
		 */
		get isInstallment() {
			return !!state?.checkout?.is_installment;
		},

		/**
		 * Get the line item variant.
		 */
		get lineItemVariant() {
			const { line_item } = getContext();
			return (
				(line_item?.variant_options || [])
					.filter(Boolean)
					.join(' / ') || null
			);
		},
	},

	callbacks: {
		/**
		 * Get the current state.
		 */
		getState(prop = null) {
			if (prop === null) {
				return getContext();
			}

			return getContext()?.[prop] || false;
		},

		/**
		 * Initialize the checkout store.
		 * This is called when the store is initialized.
		 */
		init() {
			const { mode, formId } = getContext();
			const checkout = getCheckoutData(mode, formId);
			actions.setCheckout(checkout, mode, formId);
		},

		syncTabs(e) {
			if (e?.key !== LOCAL_STORAGE_KEY) {
				return;
			}
			const { mode, formId } = getContext();
			const checkout = getCheckoutData(mode, formId);
			actions.setCheckout(checkout, mode, formId);
		},

		/**
		 * Handle checkout change.
		 */
		onChangeCheckout() {
			const { checkout, oldCheckout } = state;

			// Trigger events based on the checkout data.
			processCheckoutEvents(checkout, oldCheckout);
		},
	},

	actions: {
		/**
		 * Toggle the discount input.
		 */
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

		/**
		 * Set the promotion code.
		 */
		setPromotionCode(e) {
			state.promotionCode = e?.target?.value || '';
		},

		/**
		 * Trigger the apply discount action on key press.
		 *
		 * We're handling it additionally here to maintain an order with
		 * escape key calling for this input and cart drawer.
		 */
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

		/**
		 * Apply the promotion code.
		 */
		applyDiscount: async (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (!state.promotionCode) {
				return;
			}

			const { mode, formId } = getContext();

			speak(__('Applying promotion code.', 'surecart'), 'assertive');
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

				speak(
					sprintf(
						/* translators: %s: promotion code */
						__('Promotion code %s has been applied.', 'surecart'),
						state.promotionCode
					),
					'assertive'
				);
				state.error = '';
				actions.setCheckout(checkout, mode, formId);

				// Move focus back to #sc-coupon-remove-discount button.
				moveFocusToElement('#sc-coupon-remove-discount');
			}
		},

		/**
		 * Remove the promotion code.
		 */
		removeDiscount: async () => {
			const context = getContext();
			const { mode, formId } = context;
			speak(__('Removing promotion code.', 'surecart'), 'assertive');
			const checkout = await handleCouponApply(null);

			if (checkout) {
				state.promotionCode = '';
				context.discountInputOpen = false;
				actions.setCheckout(checkout, mode, formId);
				speak(
					__('Promotion code has been removed.', 'surecart'),
					'assertive'
				);

				// Move focus back to #sc-coupon-trigger button.
				moveFocusToElement('#sc-coupon-trigger');
			}
		},

		/**
		 * Close the coupon input on click outside.
		 */
		closeCouponOnClickOutside: (e) => {
			const context = getContext();

			// if the click is inside the coupon form, do nothing
			if (e && e.target.closest('.sc-coupon-form')) return;

			if (!context.discountInputOpen) return;

			context.discountInputOpen = false;
		},

		/**
		 * Set the checkout data.
		 * We also keep track of the old checkout data to track google analytics events.
		 */
		setCheckout(data, mode, formId) {
			let checkout = getCheckoutData(mode, formId);

			if (!checkout) {
				return;
			}

			// Keep the old checkout to track google analytics events.
			state.oldCheckout = checkout;

			// Find the checkout by mode and formId.
			let checkoutStorage = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_KEY)
			);

			// If there is no checkout storage, create a new one.
			if (!checkoutStorage) {
				checkoutStorage = {
					live: {},
					test: {},
				};
			}

			// Update the checkout data in the storage.
			checkoutStorage = {
				...checkoutStorage,
				[mode]: {
					...checkoutStorage[mode],
					[formId]: data,
				},
			};

			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify(checkoutStorage)
			);

			state.checkout = getCheckoutData(mode, formId);
		},

		/**
		 * Increase the quantity of the line item.
		 */
		onQuantityIncrease: (e) => {
			if (isNotKeySubmit(e)) {
				return true;
			}
			const { line_item } = getContext();
			const quantity = line_item?.quantity + 1;
			actions.updateLineItem({ quantity });
			speak(
				sprintf(
					/* translators: %d: quantity */
					__('Quantity increased to %d.', 'surecart'),
					quantity
				),
				'assertive'
			);
		},

		/**
		 * Decrease the quantity of the line item.
		 */
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
			speak(
				sprintf(
					/* translators: %d: quantity */
					__('Quantity decreased to %d.', 'surecart'),
					quantity
				),
				'assertive'
			);
		},

		/**
		 * Change the quantity of the line item.
		 */
		onQuantityChange: (e) => {
			const quantity = parseInt(e.target.value || '');
			actions.updateLineItem({ quantity });
		},

		/**
		 * Update the line item.
		 */
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

		/**
		 * Remove the line item.
		 */
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
