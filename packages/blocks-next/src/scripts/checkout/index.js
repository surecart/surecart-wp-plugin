/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { __, sprintf, _n } = wp.i18n;
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
			return state.checkout?.line_items_count || 0;
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
		 * Get the checkout line items.
		 */
		get checkoutLineItems() {
			return (state?.checkout?.line_items?.data || []).sort((a, b) => {
				const aHasSwap = a?.price?.current_swap || a?.swap ? 1 : 0;
				const bHasSwap = b?.price?.current_swap || b?.swap ? 1 : 0;
				return bHasSwap - aHasSwap;
			});
		},

		/**
		 * Get the line item fees.
		 */
		get lineItemFees() {
			const { line_item } = getContext();
			return line_item?.fees?.data || [];
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

		get swap() {
			const { line_item } = getContext();
			return line_item?.swap || line_item?.price?.current_swap;
		},

		get swapDisplayAmount() {
			return state?.swap?.swap_price?.display_amount;
		},

		get swapIntervalText() {
			return state?.swap?.swap_price?.short_interval_text;
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

		get lineItemPermalink() {
			const { line_item } = getContext();
			const product = line_item?.price?.product;
			if (!product?.is_published) {
				return null;
			}
			return product?.permalink;
		},

		/**
		 * Get the cart/checkout additional errors.
		 */
		get additionalErrors() {
			return (state?.error?.additional_errors || []).map(
				(e) => e.message
			);
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

		/**
		 * Get the line item variant.
		 */
		get lineItemPriceName() {
			const { line_item } = getContext();
			return line_item.price.name ?? '';
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
		onChangeCheckout: function* () {
			const { checkout, oldCheckout } = state;

			// line items have not changed.
			if (
				JSON.stringify(checkout?.line_items?.data || []) ===
				JSON.stringify(oldCheckout?.line_items?.data || [])
			) {
				return;
			}

			const { processCheckoutEvents } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-events'
			);

			// Trigger events based on the checkout data.
			processCheckoutEvents(checkout, oldCheckout);
		},
	},

	actions: {
		/**
		 * Fetch the checkout.
		 */
		fetch: function* () {
			// get the context.
			const { mode, formId } = getContext() ?? {};

			if (!state.checkout?.id || !mode || !formId) {
				return;
			}

			// fetch the checkout.
			const { fetchCheckout } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			try {
				const checkout = yield* fetchCheckout({
					id: state.checkout?.id,
				});
				// set the checkout.
				actions.setCheckout(checkout, mode, formId);
			} catch (error) {
				console.error(error);
				if (error?.code === 'checkout.not_found') {
					actions.clearCheckouts();
				}
			}
		},

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

		toggleSwap: function* () {
			const { line_item, mode, formId } = getContext();
			// fetch the checkout.
			const { toggleSwap } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			const checkout = yield* toggleSwap({
				id: line_item?.id,
				action: line_item?.swap ? 'unswap' : 'swap',
			});

			actions.setCheckout(checkout, mode, formId);
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
		applyDiscount: function* (e) {
			e.preventDefault();
			e.stopPropagation();

			if (!state.promotionCode) {
				return;
			}

			const { mode, formId } = getContext();

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);

			speak(__('Applying promotion code.', 'surecart'), 'assertive');

			const { handleCouponApply } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			const checkout = yield* handleCouponApply(state.promotionCode);

			if (checkout) {
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
		removeDiscount: function* () {
			const context = getContext();
			const { mode, formId } = context;
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);
			speak(__('Removing promotion code.', 'surecart'), 'assertive');
			const { handleCouponApply } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			const checkout = yield* handleCouponApply(null);

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
		 * Clear the checkout.
		 */
		clearCheckouts() {
			// Find the checkout by mode and formId.
			let checkoutStorage = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_KEY)
			);

			// Clear the checkout.
			checkoutStorage = {
				live: {},
				test: {},
			};

			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify(checkoutStorage)
			);

			state.checkout = {};
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

			// we don't have a mode, so we can't store the checkout
			if (!mode) {
				return;
			}

			// we don't want to store the checkout if the mode is different
			if (data?.live_mode !== (mode === 'live')) {
				return;
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
		onQuantityIncrease: function* (e) {
			if (isNotKeySubmit(e)) {
				return true;
			}
			const { line_item } = getContext();
			const quantity = line_item?.quantity + 1;
			yield actions.updateLineItem({ quantity });
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);
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
		onQuantityDecrease: function* (e) {
			if (isNotKeySubmit(e)) {
				return true;
			}
			const { line_item } = getContext();
			const quantity = line_item?.quantity - 1;
			if (quantity < 1) {
				return;
			}
			yield actions.updateLineItem({ quantity });
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);
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
		onQuantityChange: function* (e) {
			const quantity = parseInt(e.target.value || '');
			yield* actions.updateLineItem({ quantity });

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);
			speak(
				sprintf(
					/* translators: %d: quantity */
					__('Quantity changed to %d.', 'surecart'),
					quantity
				),
				'assertive'
			);
		},

		/**
		 * Update the line item.
		 */
		updateLineItem: function* (data) {
			state.loading = true;
			const { line_item, mode, formId } = getContext();

			const { updateCheckoutLineItem } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			const checkout = yield* updateCheckoutLineItem({
				id: line_item?.id,
				data,
			});

			actions.setCheckout(checkout, mode, formId);
			state.loading = false;
		},

		/**
		 * Remove the line item.
		 */
		removeLineItem: function* () {
			state.loading = true;
			const { line_item, mode, formId } = getContext();
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);
			speak(__('Removing line item.', 'surecart'), 'assertive');

			const { removeCheckoutLineItem } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			const checkout = yield* removeCheckoutLineItem(line_item?.id);

			actions.setCheckout(checkout, mode, formId);

			state.loading = false;
		},
		updateCheckout(e) {
			const { checkout, mode, formId } = e.detail;
			actions.setCheckout(checkout, mode, formId);
		},
	},
});

addEventListener('scCheckoutUpdated', (e) => {
	// if document has sc-checkout, bail.
	if (document.querySelector('sc-checkout')) {
		return;
	}
	actions.updateCheckout(e);
}); // Listen for checkout update on product page only.
