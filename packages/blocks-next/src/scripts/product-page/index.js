/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
import { addCheckoutLineItem } from '@surecart/checkout-actions';
const { actions: checkoutActions } = store('@surecart/checkout');
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

// controls the product page.
const { state, callbacks, actions } = store('surecart/product-page', {
	state: {
		/**
		 * Product contextual state.
		 */
		get product() {
			return callbacks.getState('product');
		},
		get selectedPrice() {
			return callbacks.getState('selectedPrice') || {};
		},
		get selectedVariant() {
			return callbacks.getState('selectedVariant');
		},
		get variantValues() {
			return callbacks.getState('variantValues');
		},
		get busy() {
			return callbacks.getState('busy');
		},
		get error() {
			return callbacks.getState('error');
		},

		/**
		 * Derived state
		 */
		/** Get the product quantity */
		get quantity() {
			if (state?.selectedPrice?.ad_hoc) return 1;

			return callbacks.getState('quantity') || 1;
		},
		/** Get the selected amount. */
		get selectedAmount() {
			return (
				state?.selectedVariant?.amount ||
				state?.selectedPrice?.amount ||
				''
			);
		},
		/** Get the selected display amount. */
		get selectedDisplayAmount() {
			return (
				state?.selectedVariant?.display_amount ||
				state?.selectedPrice?.display_amount ||
				''
			);
		},
		/** Is the product on sale? */
		get isOnSale() {
			if (state?.selectedPrice?.ad_hoc) {
				return false;
			}
			return state.selectedPrice.scratch_amount > state.selectedAmount;
		},
		/** Is the option unavailable */
		get isOptionUnavailable() {
			const { optionNumber, option_value } = getContext();
			return isProductVariantOptionSoldOut(
				parseInt(optionNumber),
				option_value,
				state.variantValues,
				state.product
			);
		},
		/** Is the option selected? */
		get isOptionSelected() {
			const { optionNumber, option_value } = getContext();
			return (
				state.variantValues[`option_${optionNumber}`] === option_value
			);
		},
		/** Is the price selected? */
		get isPriceSelected() {
			const { price } = getContext();
			return state.selectedPrice?.id === price?.id;
		},
		/** Get the selected option. */
		get getSelectedOption() {
			const { optionNumber } = getContext();
			return state.variantValues[`option_${optionNumber}`];
		},
		get checkoutUrl() {
			const { checkoutUrl, addToCart } = getContext();
			if (addToCart) {
				return '';
			}
			return addQueryArgs(checkoutUrl, {
				line_items: [state.lineItem],
				no_cart: true,
			});
		},
		get buttonText() {
			const { text, outOfStockText, unavailableText } = getContext();

			if (state.isSoldOut) {
				return outOfStockText;
			}

			if (state.isUnavailable) {
				return unavailableText;
			}

			return text;
		},
		get isUnavailable() {
			return (
				state?.product?.archived || // archived.
				state?.isSoldOut || // sold out.
				(state?.variants?.length && !state?.selectedVariant?.id) // no selected variant.
			);
		},
		get isSoldOut() {
			if (
				!state?.product?.stock_enabled ||
				state?.product?.allow_out_of_stock_purchases
			) {
				return false;
			}
			return state.selectedVariant?.id
				? state.selectedVariant?.available_stock <= 0
				: state.product?.available_stock <= 0;
		},
		/** Line item to add to cart. */
		get lineItem() {
			return {
				price: state.selectedPrice?.id,
				quantity: Math.max(
					state.selectedPrice?.ad_hoc ? 1 : state.quantity,
					1
				),
				...(state.selectedPrice?.ad_hoc
					? {
							ad_hoc_amount: !state?.selectedPrice
								?.is_zero_decimal
								? state.adHocAmount * 100
								: state.adHocAmount,
					  }
					: {}),
				...(state.selectedVariant?.id
					? { variant: state.selectedVariant?.id }
					: {}),
			};
		},
		/** Get the formatted selected price */
		get formattedSelectedPrice() {
			if (!state.selectedPrice?.id) return;
			const formatted = { ...state.selectedPrice };

			// format zero decimal prices.
			if (!formatted?.is_zero_decimal) {
				[
					'full_amount',
					'amount',
					'display_amount',
					'scratch_amount',
					'ad_hoc_min_amount',
					'ad_hoc_max_amount',
					'setup_fee_amount',
				].forEach((key) => {
					formatted[key] = parseFloat(formatted[key]) / 100;
				});
			}

			return formatted;
		},
		/** Is the add to cart/buy disabled? */
		get disabled() {
			return state?.selectedPrice?.archived || state?.product?.archived;
		},
		/** Get the selected variant id. */
		get selectedVariantId() {
			return state.selectedVariant?.id;
		},
		/** Get the min product quantity */
		get minQuantity() {
			return 1; //return 1 as the minimum quantity.
		},
		/** Get the max product quantity */
		get maxQuantity() {
			// check purchase limit.
			if (state.product?.purchase_limit) {
				return state.product.purchase_limit;
			}

			// check if stock needs to be checked
			const isStockNeedsToBeChecked = !!(
				state.product?.stock_enabled &&
				!state.product?.allow_out_of_stock_purchases
			);

			// if stock is not enabled return infinity.
			if (!isStockNeedsToBeChecked) {
				return Infinity;
			}

			// if no variant is selected, check against product stock.
			if (!state.selectedVariant) {
				return state.product.available_stock;
			}

			// check against variant stock.
			return state.selectedVariant.available_stock;
		},
		/** Is the quantity disabled? */
		get isQuantityDisabled() {
			return !!state?.selectedPrice?.ad_hoc;
		},
		/** Is quantity increase disabled? */
		get isQuantityIncreaseDisabled() {
			return (
				state.isQuantityDisabled || state.quantity >= state.maxQuantity
			);
		},
		/** Is quantity decrease disabled? */
		get isQuantityDecreaseDisabled() {
			return (
				state.isQuantityDisabled || state.quantity <= state.minQuantity
			);
		},
	},

	actions: {
		addToCart: async () => {
			if (!state.selectedPrice?.id) return;

			if (
				state.selectedPrice?.ad_hoc &&
				(null === state.adHocAmount || undefined === state.adHocAmount)
			) {
				return;
			}

			let checkout = null;
			// update({ busy: true });
			try {
				state.loading = true;
				checkout = await addCheckoutLineItem({
					price: state.selectedPrice?.id,
					quantity: Math.max(
						state.selectedPrice?.ad_hoc ? 1 : state?.quantity,
						1
					),
					...(state.selectedPrice?.ad_hoc
						? { ad_hoc_amount: state.adHocAmount }
						: {}),
					variant: state.selectedVariant?.id,
				});
			} catch (e) {
				console.error(e);
				throw e; // Re-throw the caught error
			} finally {
				// update({ busy: false });
			}

			if (checkout) {
				checkoutActions.setCheckout(checkout, state.mode, state.formId);
				checkoutActions.toggleCartSidebar(null);
			}
		},
	},

	callbacks: {
		/** Get the contextual state. */
		getState(prop) {
			const { productId } = getContext();
			return state[productId]?.[prop] || false;
		},
		handleSubmit(e) {
			e.preventDefault(); // prevent the form from submitting.
			// if the button hdoes not have a value, add to cart.
			if (!e?.submitter?.value) {
				return actions.addToCart(e);
			}
			// otherwise, redirect to the provided url.
			return window.location.assign(e.submitter.value);
		},
		/** Set the option. */
		setOption: (e) => {
			const { optionNumber, optionValue } = getContext();
			update({
				variantValues: {
					...state.variantValues,
					[`option_${optionNumber}`]: e.target.value || optionValue,
				},
			});
		},
		/** Set the option. */
		setPrice: () => {
			const { price } = getContext();
			const selectedPrice = state.product.prices?.data.find(
				(p) => p.id === price?.id
			);
			state.adHocAmount =
				parseFloat(selectedPrice?.ad_hoc ? selectedPrice?.amount : 0) /
				(selectedPrice?.is_zero_decimal ? 1 : 100);

			update({ selectedPrice });
		},
		setAdHocAmount: (e) => {
			state.adHocAmount = parseFloat(e.target.value);
		},
		formatAdHocAmount: (e) => {
			state.adHocAmount = parseFloat(e.target.value).toFixed(2);
		},
		/** Update variant and values. */
		updateSelectedVariant: () => {
			if (!state?.variantValues) {
				return;
			}
			// if we have variant values, update the selected variant.
			const selectedVariant = getVariantFromValues({
				variants: state?.product?.variants?.data,
				values: state?.variantValues || {},
			});

			if (selectedVariant?.id !== state.selectedVariant?.id) {
				return update({
					selectedVariant,
				});
			}
		},
		onQuantityChange: (e) => {
			update({
				quantity: Math.max(
					Math.min(state.maxQuantity, parseInt(e.target.value)),
					state.minQuantity
				),
			});
		},
		onQuantityDecrease: () => {
			if (state.isQuantityDisabled) return;

			update({
				quantity: Math.max(state.minQuantity, state.quantity - 1),
			});
		},
		onQuantityIncrease: () => {
			if (state.isQuantityDisabled) return;

			update({
				quantity: Math.min(state.maxQuantity, state.quantity + 1),
			});
		},
	},
});

/**
 * Update state.
 */
export const update = (data) => {
	const { productId } = getContext();
	state[productId] = {
		...state?.[productId],
		...data,
	};
};

/**
 * Get the variant from provided values.
 */
export const getVariantFromValues = ({ variants, values }) => {
	const variantValueKeys = Object.keys(values || {});

	for (const variant of variants) {
		const variantValues = ['option_1', 'option_2', 'option_3']
			.map((option) => variant[option])
			.filter((value) => value !== null && value !== undefined);

		if (
			variantValues?.length === variantValueKeys?.length &&
			variantValueKeys.every((key) => variantValues.includes(values[key]))
		) {
			return variant;
		}
	}
	return null;
};

/**
 * Is this variant option missing/unavailable?
 */
export const isProductVariantOptionMissing = (
	optionNumber,
	option,
	variantValues,
	product
) => {
	// if this is option 1, check to see if there are any variants with this option.
	if (optionNumber === 1) {
		return !(product?.variants?.data || []).some(
			(variant) => variant.option_1 === option
		);
	}

	// if this is option 2, check to see if there are any variants with this option and option 1
	if (optionNumber === 2) {
		return !(product?.variants?.data || []).some(
			(variant) =>
				variant?.option_1 === variantValues?.option_1 &&
				variant?.option_2 === option
		);
	}

	// if this is option 3, check to see if there are any variants with all the options.
	return !(product?.variants?.data || []).some(
		(variant) =>
			variant?.option_1 === variantValues?.option_1 &&
			variant?.option_2 === variantValues?.option_2 &&
			variant.option_3 === option
	);
};

/**
 * Is this variant option sold out.
 */
export const isProductVariantOptionSoldOut = (
	optionNumber,
	option,
	variantValues,
	product
) => {
	// product stock is not enabled or out of stock purchases are allowed.
	if (!product?.stock_enabled || product?.allow_out_of_stock_purchases)
		return false;

	// if this is option 1, check to see if there are any variants with this option.
	if (optionNumber === 1) {
		const items = (product.variants?.data || []).filter?.(
			(variant) => variant.option_1 === option
		);
		const highestStock = Math.max(
			...items.map((item) => item.available_stock)
		);
		return highestStock <= 0;
	}

	// if this is option 2, check to see if there are any variants with this option and option 1
	if (optionNumber === 2) {
		const items = (product.variants?.data || []).filter(
			(variant) =>
				variant?.option_1 === variantValues.option_1 &&
				variant.option_2 === option
		);
		const highestStock = Math.max(
			...items.map((item) => item.available_stock)
		);
		return highestStock <= 0;
	}

	// if this is option 4, check to see if there are any variants with all the options.
	const items = (product.variants?.data || []).filter(
		(variant) =>
			variant?.option_1 === variantValues.option_1 &&
			variant?.option_2 === variantValues.option_2 &&
			variant.option_3 === option
	);
	const highestStock = Math.max(...items.map((item) => item.available_stock));
	return highestStock <= 0;
};
