/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

// controls the product page.
const { state, callbacks } = store('surecart/product', {
	state: {
		/**
		 * Product contextual state.
		 */
		get product() {
			return callbacks.getState('product');
		},
		get selectedPrice() {
			return callbacks.getState('selectedPrice');
		},
		get selectedVariant() {
			return callbacks.getState('selectedVariant');
		},
		get variantValues() {
			return callbacks.getState('variantValues');
		},
		get quantity() {
			return callbacks.getState('quantity');
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
			return state.selectedPrice.scratch_amount > state.selectedAmount;
		},
		/** Is the option unavailable */
		get isOptionUnavailable() {
			const { optionNumber, optionValue } = getContext();
			return isProductVariantOptionSoldOut(
				parseInt(optionNumber),
				optionValue,
				state.variantValues,
				state.product
			);
		},
		/** Is the option selected? */
		get isOptionSelected() {
			const { optionNumber, optionValue } = getContext();
			return (
				state.variantValues[`option_${optionNumber}`] === optionValue
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
			const { checkoutUrl } = getContext();
			return addQueryArgs(checkoutUrl, {
				line_items: [state.lineItem],
				no_cart: true,
			});
		},
		get buttonText() {
			const { text, outOfStockText } = getContext();
			if (state.isSoldOut) {
				return outOfStockText;
			}
			return text;
		},
		get isUnavailable() {
			return (
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
					? { ad_hoc_amount: state.adHocAmount }
					: {}),
				...(state.selectedVariant?.id
					? { variant: state.selectedVariant?.id }
					: {}),
			};
		},
		/** Is the add to cart/buy disabled? */
		get disabled() {
			return state?.selectedPrice?.archived || state?.product?.archived;
		},
		/** Get the ad_hoc amount. */
		get adHocAmount() {
			return state?.selectedPrice?.amount || null;
		},
		/** Get the selected variant id. */
		get selectedVariantId() {
			return state.selectedVariant?.id;
		},
	},

	actions: {
		*addToCart(e) {
			e.preventDefault();
			try {
				update({ busy: true });
				// TODO: replace with interactivity when available.
				yield window.sc.checkout.addLineItem(state.lineItem);
				window.sc.cart.toggle(true);
				// open cart.
			} catch (error) {
				update({ error });
			} finally {
				update({ busy: false });
			}
		},
	},

	callbacks: {
		/** Get the contextual state. */
		getState(prop) {
			const { productId } = getContext();
			return state[productId]?.[prop] || false;
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
			update({ selectedPrice });
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
