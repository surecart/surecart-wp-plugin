/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
import { addCheckoutLineItem } from '@surecart/checkout-service';
const { actions: checkoutActions } = store('surecart/checkout');
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

// controls the product page.
const { state, actions } = store('surecart/product-page', {
	state: {
		/**
		 * Get the product quantity based on the selected price.
		 */
		get quantity() {
			const { selectedPrice, quantity } = getContext();
			if (selectedPrice?.ad_hoc) return 1;
			return quantity;
		},

		/**
		 * Get the amount based on the selected variant or price.
		 */
		get selectedAmount() {
			const { selectedPrice } = getContext();
			if (prices?.length > 1) {
				return selectedPrice?.amount || '';
			}
			return state.selectedVariant?.amount || selectedPrice?.amount || '';
		},

		/**
		 * Get the selected display amount based on the selected variant or price.
		 */
		get selectedDisplayAmount() {
			const { prices, selectedPrice } = getContext();
			if (prices?.length > 1) {
				return selectedPrice?.display_amount || '';
			}
			return (
				state.selectedVariant?.display_amount ||
				selectedPrice?.display_amount ||
				''
			);
		},

		/**
		 * Get the selected variant.
		 */
		get selectedVariant() {
			const { variants, variantValues } = getContext();
			return variantValues
				? getVariantFromValues({
						variants: variants,
						values: variantValues || {},
				  })
				: null;
		},

		/**
		 * Is this product on sale?
		 */
		get isOnSale() {
			const { selectedAmount, selectedPrice } = getContext();
			return !selectedPrice?.ad_hoc
				? selectedPrice.scratch_amount > selectedAmount
				: false;
		},

		/**
		 * Is the option unavailable due to missing variants or stock.
		 */
		get isOptionUnavailable() {
			const { optionNumber, option_value, product, variantValues } =
				getContext();
			return isProductVariantOptionSoldOut(
				parseInt(optionNumber),
				option_value,
				variantValues,
				product
			);
		},

		/**
		 * Is the option selected?
		 */
		get isOptionSelected() {
			const { optionNumber, option_value, variantValues } = getContext();
			return variantValues?.[`option_${optionNumber}`] === option_value;
		},

		/**
		 * Is the price selected?
		 */
		get isPriceSelected() {
			const { price, selectedPrice } = getContext();
			return selectedPrice?.id === price?.id;
		},

		/**
		 * Get the checkout url based on the built line item.
		 */
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

		/**
		 * Get the button text based on the product state.
		 */
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

		/**
		 * Find out if the product is unavailable
		 * due to being archived, sold out, or no variant selected.
		 */
		get isUnavailable() {
			const { product, variants } = getContext();
			return (
				product?.archived || // archived.
				state?.isSoldOut || // sold out.
				(variants?.length && !state.selectedVariant?.id) // no selected variant.
			);
		},

		/**
		 * Is the product sold out?
		 */
		get isSoldOut() {
			const { product } = getContext();
			if (
				!product?.stock_enabled ||
				product?.allow_out_of_stock_purchases
			) {
				return false;
			}
			return state.selectedVariant?.id
				? state.selectedVariant?.available_stock <= 0
				: product?.available_stock <= 0;
		},

		/**
		 * Line item to add to cart.
		 */
		get lineItem() {
			const { adHocAmount, selectedPrice } = getContext();
			return {
				price: selectedPrice?.id,
				quantity: Math.max(
					selectedPrice?.ad_hoc ? 1 : state.quantity,
					1
				),
				...(selectedPrice?.ad_hoc
					? {
							ad_hoc_amount: !selectedPrice?.is_zero_decimal
								? adHocAmount * 100
								: adHocAmount,
					  }
					: {}),
				...(state.selectedVariant?.id
					? { variant: state.selectedVariant?.id }
					: {}),
			};
		},

		/**
		 * Is the add to cart/buy disabled?
		 */
		get disabled() {
			const { selectedPrice, product } = getContext();
			return selectedPrice?.archived || product?.archived;
		},

		/**
		 * Get the max product quantity
		 */
		get maxQuantity() {
			const { product } = getContext();
			// check purchase limit.
			if (product?.purchase_limit) {
				return product.purchase_limit;
			}

			// if stock is not enabled, or out of stock purchases are allowed, return infinity.
			if (
				!product?.stock_enabled ||
				product?.allow_out_of_stock_purchases
			) {
				return Infinity;
			}

			// if no variant is selected, check against product stock.
			if (!state.selectedVariant) {
				return product.available_stock;
			}

			// check against variant stock.
			return state.selectedVariant.available_stock;
		},

		/**
		 * Is the quantity disabled?
		 */
		get isQuantityDisabled() {
			const { selectedPrice } = getContext();
			return !!selectedPrice?.ad_hoc;
		},

		/**
		 * Is quantity increase disabled?
		 */
		get isQuantityIncreaseDisabled() {
			return (
				state.isQuantityDisabled || state.quantity >= state.maxQuantity
			);
		},

		/**
		 * Is quantity decrease disabled?
		 */
		get isQuantityDecreaseDisabled() {
			return state.isQuantityDisabled || state.quantity <= 1;
		},
	},

	actions: {
		addToCart: async () => {
			const context = getContext();
			const { mode, formId } = context;
			let checkout = null;
			try {
				context.busy = true;
				checkout = await addCheckoutLineItem(state.lineItem);
				checkoutActions.setCheckout(checkout, mode, formId);
				checkoutActions.toggleCartSidebar(null);
			} catch (e) {
				console.error(e);
				throw e; // Re-throw the caught error
			} finally {
				context.busy = false;
			}
		},
	},

	callbacks: {
		/**
		 * Handle submit callback.
		 */
		handleSubmit(e) {
			e.preventDefault(); // prevent the form from submitting.
			// if the button hdoes not have a value, add to cart.
			if (!e?.submitter?.value) {
				return actions.addToCart(e);
			}
			// otherwise, redirect to the provided url.
			return window.location.assign(e.submitter.value);
		},

		/**
		 * Set the option.
		 */
		setOption: () => {
			const context = getContext();
			context.variantValues[`option_${context?.optionNumber}`] =
				context?.option_value || e?.target?.value;
		},

		/**
		 * Set the price
		 */
		setPrice: () => {
			const context = getContext();
			const { product, price } = context;
			const selectedPrice = product.prices?.data.find(
				(p) => p.id === price?.id
			);

			context.selectedPrice = selectedPrice;
			context.adHocAmount = null;
		},

		/**
		 * Set the ad_hoc_amount
		 */
		setAdHocAmount: (e) => {
			const context = getContext();
			context.adHocAmount = parseFloat(e.target.value);
		},

		/**
		 * Handle the quantity change.
		 */
		onQuantityChange: (e) => {
			const context = getContext();
			context.quantity = Math.max(
				Math.min(state.maxQuantity, parseInt(e.target.value)),
				1
			);
		},

		/**
		 * Handle the quantity decrease.
		 */
		onQuantityDecrease: () => {
			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity = Math.max(1, state.quantity - 1);
		},

		/**
		 * Handle the quantity increase.
		 */
		onQuantityIncrease: () => {
			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity = Math.min(state.maxQuantity, state.quantity + 1);
		},
	},
});

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
