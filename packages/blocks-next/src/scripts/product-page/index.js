/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

// controls the product page.
const { state, callbacks, actions } = store('surecart/product-page', {
	state: {
		/**
		 * Product contextual state.
		 */
		// get product() {
		// 	return callbacks.getState('product');
		// },
		// get selectedPrice() {
		// 	return callbacks.getState('selectedPrice') || {};
		// },
		// get selectedVariant() {
		// 	return callbacks.getState('selectedVariant');
		// },
		// get variantValues() {
		// 	return callbacks.getState('variantValues');
		// },
		// get busy() {
		// 	return callbacks.getState('busy');
		// },
		// get error() {
		// 	return callbacks.getState('error');
		// },

		/**
		 * Derived state
		 */
		/** Get the product quantity */
		get quantity() {
			const { selectedPrice, quantity } = getContext();
			if (selectedPrice?.ad_hoc) return 1;
			return quantity;
		},
		/** Get the selected amount. */
		get selectedAmount() {
			const { selectedVariant, selectedPrice } = getContext();
			return selectedVariant?.amount || selectedPrice?.amount || '';
		},
		/** Get the selected display amount. */
		get selectedDisplayAmount() {
			const { selectedVariant, selectedPrice } = getContext();
			return (
				selectedVariant?.display_amount ||
				selectedPrice?.display_amount ||
				''
			);
		},
		/** Is the product on sale? */
		get isOnSale() {
			const { selectedAmount, selectedPrice } = getContext();
			if (selectedPrice?.ad_hoc) {
				return false;
			}
			return selectedPrice.scratch_amount > selectedAmount;
		},
		/** Is the option unavailable */
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
		/** Is the option selected? */
		get isOptionSelected() {
			const { optionNumber, option_value, variantValues } = getContext();
			return variantValues[`option_${optionNumber}`] === option_value;
		},
		/** Is the price selected? */
		get isPriceSelected() {
			const { price, selectedPrice } = getContext();
			return selectedPrice?.id === price?.id;
		},
		/** Get the selected option. */
		get getSelectedOption() {
			const { optionNumber, variantValues } = getContext();
			return variantValues[`option_${optionNumber}`];
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
			const { product, variants, selectedVariant } = getContext();
			return (
				product?.archived || // archived.
				state?.isSoldOut || // sold out.
				(variants?.length && !selectedVariant?.id) // no selected variant.
			);
		},
		get isSoldOut() {
			const { product, selectedVariant } = getContext();
			if (
				!product?.stock_enabled ||
				product?.allow_out_of_stock_purchases
			) {
				return false;
			}
			return selectedVariant?.id
				? selectedVariant?.available_stock <= 0
				: product?.available_stock <= 0;
		},
		/** Line item to add to cart. */
		get lineItem() {
			const { adHocAmount, selectedPrice, selectedVariant } =
				getContext();
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
				...(selectedVariant?.id
					? { variant: selectedVariant?.id }
					: {}),
			};
		},
		/** Is the add to cart/buy disabled? */
		get disabled() {
			const { selectedPrice, product } = getContext();
			return selectedPrice?.archived || product?.archived;
		},
		/** Get the max product quantity */
		get maxQuantity() {
			const { product, selectedVariant } = getContext();
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
			if (!selectedVariant) {
				return product.available_stock;
			}

			// check against variant stock.
			return selectedVariant.available_stock;
		},
		/** Is the quantity disabled? */
		get isQuantityDisabled() {
			const { selectedPrice } = getContext();
			return !!selectedPrice?.ad_hoc;
		},
		/** Is quantity increase disabled? */
		get isQuantityIncreaseDisabled() {
			return (
				state.isQuantityDisabled || state.quantity >= state.maxQuantity
			);
		},
		/** Is quantity decrease disabled? */
		get isQuantityDecreaseDisabled() {
			return state.isQuantityDisabled || state.quantity <= 1;
		},
	},

	actions: {
		*addToCart() {
			const context = getContext();
			try {
				context.busy = true;
				// TODO: replace with interactivity when available.
				yield window.sc.checkout.addLineItem(state.lineItem);
				window.sc.cart.toggle(true);
				// open cart.
			} catch (error) {
				context.error = error;
			} finally {
				context.busy = false;
			}
		},
	},

	callbacks: {
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
			const context = getContext();
			const { optionNumber, optionValue, variantValues } = context;
			context.variantValues = {
				...variantValues,
				[`option_${optionNumber}`]: e.target.value || optionValue,
			};
		},
		/** Set the option. */
		setPrice: () => {
			const context = getContext();
			const { product, price } = context;
			const selectedPrice = product.prices?.data.find(
				(p) => p.id === price?.id
			);
			const adHocAmount =
				parseFloat(selectedPrice?.ad_hoc ? selectedPrice?.amount : 0) /
				(selectedPrice?.is_zero_decimal ? 1 : 100);

			context.selectedPrice = selectedPrice;
			context.adHocAmount = adHocAmount;
		},
		setAdHocAmount: (e) => {
			const context = getContext();
			context.adHocAmount = parseFloat(e.target.value);
		},
		formatAdHocAmount: (e) => {
			const context = getContext();
			context.adHocAmount = parseFloat(e.target.value).toFixed(2);
		},
		/** Update variant and values. */
		updateSelectedVariant: () => {
			const context = getContext();
			if (!context?.variantValues) {
				return;
			}
			// if we have variant values, update the selected variant.
			const selectedVariant = getVariantFromValues({
				variants: context?.product?.variants?.data,
				values: context?.variantValues || {},
			});

			if (selectedVariant?.id !== context?.selectedVariant?.id) {
				context.selectedVariant = selectedVariant;
			}
		},
		onQuantityChange: (e) => {
			const context = getContext();
			context.quantity = Math.max(
				Math.min(state.maxQuantity, parseInt(e.target.value)),
				1
			);
		},
		onQuantityDecrease: () => {
			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity = Math.max(1, state.quantity - 1);
		},
		onQuantityIncrease: () => {
			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity = Math.min(state.maxQuantity, state.quantity + 1);
		},
	},
});

/**
 * Update state.
 */
export const update = (data) => {
	let context = getContext();
	context = {
		...context,
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
