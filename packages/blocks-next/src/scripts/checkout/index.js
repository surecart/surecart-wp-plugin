/**
 * WordPress dependencies.
 */
import {
	store,
	getContext,
	getElement,
	withSyncEvent,
} from '@wordpress/interactivity';
const { __, sprintf, _n } = wp.i18n;
const LOCAL_STORAGE_KEY = 'surecart-local-storage';
let announceTimeout = null;

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
	return e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ';
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
		 * Get the number of user-visible line items in checkout.
		 */
		get itemsCount() {
			return state.cartLineItems.length;
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
			if (
				!!line_item?.ad_hoc_amount ||
				!line_item?.scratch_display_amount
			) {
				return false;
			}

			return line_item.scratch_amount !== line_item.subtotal_amount;
		},

		/**
		 * Get the line item note.
		 */
		get lineItemNote() {
			const { line_item } = getContext();
			return line_item?.display_note || '';
		},

		/**
		 * Check if the discount is applied to the cart/checkout.
		 */
		get isDiscountApplied() {
			return !!state?.checkout?.discount?.promotion?.code;
		},

		/**
		 * Check if the checkout has a discount amount applied.
		 */
		get hasDiscountAmount() {
			return !!state?.checkout?.discount_amount;
		},

		/**
		 * Check if the checkout has a subtotal scratch amount different from the subtotal.
		 */
		get hasSubtotalScratchAmount() {
			return !!state?.checkout?.has_subtotal_scratch_amount;
		},

		/**
		 * Get the aria label for the subtotal scratch amount.
		 */
		get subtotalScratchAriaLabel() {
			const amount = state?.checkout?.subtotal_scratch_display_amount;
			return amount
				? `${__('Original price:', 'surecart')} ${amount}`
				: '';
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
		 * Non-component line items for cart display; components render nested
		 * under their parent.
		 */
		get cartLineItems() {
			return state.checkoutLineItems.filter(
				(item) => !item.component_line_item
			);
		},

		/**
		 * Is the context line item a bundle parent? Components are never parents.
		 */
		get isBundleParent() {
			const { line_item } = getContext();
			if (line_item?.component_line_item) return false;
			return !!line_item?.price?.product?.bundle;
		},

		/**
		 * Get the bundle components for the current line item (from context).
		 *
		 * Components without a variant selection are skipped.
		 */
		get bundleComponents() {
			const { line_item } = getContext();
			if (!line_item?.price?.product?.bundle) return [];
			const components = line_item?.component_line_items?.data || [];
			return components.filter(
				(component) =>
					(component?.variant_options || []).filter(Boolean).length >
					0
			);
		},

		/**
		 * Get the count of bundle components.
		 */
		get bundleComponentsCount() {
			return state.bundleComponents.length;
		},

		/**
		 * Whether the current line item has bundle components to display.
		 */
		get hasBundleComponents() {
			return state.bundleComponentsCount > 0;
		},

		/**
		 * Whether the line item has any extra details (bundle components or a
		 * note) for the `cart-line-item-details` container to show. The parent
		 * container hides itself when there's nothing to render.
		 */
		get hasLineItemDetails() {
			return state.hasBundleComponents || !!state.lineItemNote;
		},

		/**
		 * Label half of a bundle component row.
		 */
		get lineItemBundleComponent() {
			const { bundle_component } = getContext();
			if (!bundle_component) return '';

			const name = bundle_component?.price?.product?.name || '';
			const variants = (bundle_component?.variant_options || [])
				.filter(Boolean)
				.join(' / ');

			return variants ? `${name} - ${variants}` : name;
		},

		/**
		 * "× N" multiplier for a bundle component row. A single unit (× 1) is
		 * never shown — only quantities above one get the multiplier.
		 */
		get lineItemBundleComponentQty() {
			const { bundle_component } = getContext();
			const qty = Math.max(Number(bundle_component?.quantity) || 1, 1);
			return qty > 1 ? `× ${qty}` : '';
		},

		/**
		 * Get the bundle components label text.
		 */
		get bundleComponentsLabel() {
			const count = state.bundleComponentsCount;
			return count > 0
				? sprintf(
						_n(
							'Includes %d item',
							'Includes %d items',
							count,
							'surecart'
						),
						count
				  )
				: '';
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

		get swapIntervalCountText() {
			return state?.swap?.swap_price?.short_interval_count_text;
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
					'Total of %d item in your cart',
					'Total of %d items in your cart',
					count,
					'surecart'
				),
				count
			);
		},

		/**
		 * Get the aria label for the cart icon count.
		 */
		get lineItemAriaLabel() {
			const { line_item } = getContext('surecart/checkout');
			return sprintf(
				__('Cart item: %s. Quantity %d. Total price %s.', 'surecart'),
				line_item?.price?.product?.name,
				line_item?.quantity,
				line_item?.subtotal_display_amount
			);
		},

		/**
		 * The cart dialog label.
		 */
		get removeItemAriaLabel() {
			const { line_item } = getContext('surecart/checkout');
			return sprintf(
				__('Remove %s from your cart.', 'surecart'),
				line_item?.price?.product?.name
			);
		},

		/**
		 * Get the aria label for increasing quantity.
		 */
		get increaseQuantityAriaLabel() {
			const { line_item } = getContext('surecart/checkout');
			return sprintf(
				/* translators: %s: product name */
				__('Increase quantity for %s.', 'surecart'),
				line_item?.price?.product?.name
			);
		},

		/**
		 * Get the aria label for decreasing quantity.
		 */
		get decreaseQuantityAriaLabel() {
			const { line_item } = getContext('surecart/checkout');
			return sprintf(
				/* translators: %s: product name */
				__('Decrease quantity for %s.', 'surecart'),
				line_item?.price?.product?.name
			);
		},

		/**
		 * Get the aria label for quantity input.
		 */
		get quantityInputAriaLabel() {
			const { line_item } = getContext('surecart/checkout');
			return sprintf(
				/* translators: %s: product name */
				__('Quantity for %s.', 'surecart'),
				line_item?.price?.product?.name
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

		/**
		 * Get the line item variant.
		 */
		get showLineItemsCount() {
			const { line_item } = getContext();
			return line_item?.quantity > 1;
		},

		/**
		 * Check if the quantity controls are disabled (loading or ad_hoc price).
		 */
		get isQuantityDisabled() {
			return !!state.loading;
		},

		/**
		 * Check if the quantity increase button is disabled.
		 */
		get isQuantityIncreaseDisabled() {
			const { line_item } = getContext('surecart/checkout');
			return (
				state.isQuantityDisabled ||
				(line_item?.max && line_item?.quantity >= line_item?.max)
			);
		},

		/**
		 * Check if the quantity decrease button is disabled.
		 */
		get isQuantityDecreaseDisabled() {
			const { line_item } = getContext('surecart/checkout');
			return (
				state.isQuantityDisabled ||
				line_item?.quantity <= (line_item?.min || 1)
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
		toggleDiscountInput: withSyncEvent(function (e) {
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
		}),

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
		maybeApplyDiscountOnKeyChange: withSyncEvent(function (e) {
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
		}),

		/**
		 * Apply the promotion code.
		 */
		applyDiscount: withSyncEvent(function* (e) {
			e.preventDefault();
			e.stopPropagation();

			if (!state.promotionCode) {
				return;
			}

			const { mode, formId } = getContext();

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
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
				actions.announceLatestCheckout();
				// Move focus back to #sc-coupon-remove-discount button.
				moveFocusToElement('#sc-coupon-remove-discount');
			}
		}),

		/**
		 * Remove the promotion code.
		 */
		removeDiscount: function* () {
			const context = getContext();
			const { mode, formId } = context;
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
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
				actions.announceLatestCheckout();
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
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);
			speak(__('Updating quantity.', 'surecart'), 'assertive');
			yield actions.updateLineItem({ quantity });
			speak(
				sprintf(
					/* translators: %d: quantity */
					__('Quantity increased to %d.', 'surecart'),
					quantity
				),
				'assertive'
			);
			actions.announceLatestCheckout();
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
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);
			speak(__('Updating quantity.', 'surecart'), 'assertive');
			yield actions.updateLineItem({ quantity });
			speak(
				sprintf(
					/* translators: %d: quantity */
					__('Quantity decreased to %d.', 'surecart'),
					quantity
				),
				'assertive'
			);
			actions.announceLatestCheckout();
		},

		/**
		 * Change the quantity of the line item.
		 */
		onQuantityChange: function* (e) {
			const quantity = parseInt(e.target.value || '');
			yield actions.updateLineItem({ quantity });

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);
			speak(
				sprintf(
					/* translators: %d: quantity */
					__('Quantity changed to %d.', 'surecart'),
					quantity
				),
				'assertive'
			);
			actions.announceLatestCheckout();
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
		removeLineItem: withSyncEvent(function* (e) {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e.preventDefault();

			state.loading = true;
			const { line_item, mode, formId } = getContext();
			const productName =
				line_item?.price?.product?.name || __('item', 'surecart');
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);

			speak(
				sprintf(
					__('Removing %s from your cart.', 'surecart'),
					productName
				),
				'assertive'
			);

			const { removeCheckoutLineItem } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			const checkout = yield* removeCheckoutLineItem(line_item?.id);

			actions.setCheckout(checkout, mode, formId);

			state.loading = false;

			speak(
				sprintf(
					__('Removed %s from your cart.', 'surecart'),
					productName
				),
				'assertive'
			);
			actions.announceLatestCheckout();

			// Move focus to the first remaining remove button, or fall back to the cart close button.
			requestAnimationFrame(() => {
				const nextFocus =
					document.querySelector(
						'.wp-block-surecart-cart-line-item-remove, .sc-product-line-item__remove-button'
					) ||
					document.querySelector(
						'.wp-block-surecart-cart-close-button'
					);
				nextFocus?.focus();
			});
		}),
		updateCheckout(e) {
			const { checkout, mode, formId } = e.detail;
			actions.setCheckout(checkout, mode, formId);
		},
		announceLatestCheckout: function* () {
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);
			clearTimeout(announceTimeout);
			announceTimeout = setTimeout(() => {
				speak(
					sprintf(
						__(
							'Checkout updated. The subtotal is %1$s.',
							'surecart'
						),
						state?.checkout?.subtotal_display_amount
					),
					'polite'
				);
			}, 1000);
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
