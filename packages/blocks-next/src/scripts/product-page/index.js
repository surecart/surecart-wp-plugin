/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
import { addCheckoutLineItem } from '@surecart/checkout-service';
const { actions: checkoutActions } = store('surecart/checkout');
const { actions: cartActions, state: cartState } = store('surecart/cart');
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.
const { speak } = wp.a11y;
const { sprintf, __ } = wp.i18n;
const { scProductViewed } = require('./events');

/**
 * Check if the key is not submit key.
 */
const isNotKeySubmit = (e) => {
	return e.type === 'keydown' && e.key !== 'Enter' && e.code !== 'Space';
};

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
			const context = getContext();
			if (!context) {
				return true;
			}
			const { selectedPrice, prices } = context;
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
			const context = getContext();
			if (!context) {
				return true;
			}
			const { variants, variantValues } = context;
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
			const context = getContext();
			if (!context) {
				return true;
			}
			const { selectedPrice } = context;
			return !selectedPrice?.ad_hoc
				? selectedPrice.scratch_amount > state.selectedAmount
				: false;
		},

		/**
		 * Is the option unavailable due to missing variants or stock.
		 */
		get isOptionUnavailable() {
			const context = getContext();
			if (!context) {
				return true;
			}
			const {
				optionNumber,
				option_value,
				product,
				variants,
				variantValues,
			} = context;
			return isProductVariantOptionSoldOut(
				parseInt(optionNumber),
				option_value,
				variantValues,
				variants,
				product
			);
		},

		/**
		 * Is the option selected?
		 */
		get isOptionSelected() {
			const context = getContext();
			if (!context) {
				return true;
			}
			const { optionNumber, option_value, variantValues } = context;
			return variantValues?.[`option_${optionNumber}`] === option_value;
		},

		/**
		 * Is the option value selected
		 */
		get isOptionValueSelected() {
			const context = getContext();
			if (!context) {
				return true;
			}
			const { optionValue, variantValues } = context;

			// this applies to all variants or the option is always displayed.
			if (!optionValue) {
				return true;
			}

			const values = Object.values(variantValues).map((value) =>
				value.toLowerCase()
			);

			return values.includes(optionValue.toLowerCase());
		},

		get shouldDisplayImage() {
			const context = getContext();
			if (!context) {
				return true;
			}
			const { variantImagesEnabled } = context;
			if (!variantImagesEnabled) {
				return true;
			}
			return state.isOptionValueSelected;
		},

		/**
		 * Get the image display.
		 */
		get imageDisplay() {
			return state.shouldDisplayImage ? 'initial' : 'none';
		},

		/**
		 * Is the price selected?
		 */
		get isPriceSelected() {
			const context = getContext();
			if (!context) {
				return true;
			}
			const { price, selectedPrice } = context;
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
			const context = getContext();
			if (!context) {
				return true;
			}
			const { text, outOfStockText, unavailableText } = context;
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
			const context = getContext();
			if (!context) {
				return true;
			}
			const { product, variants } = context;
			return (
				!!product?.archived || // archived.
				!!state?.isSoldOut || // sold out.
				!!(variants?.length && !state.selectedVariant?.id) // no selected variant.
			);
		},

		/**
		 * Is the product sold out?
		 */
		get isSoldOut() {
			const context = getContext();
			if (!context) {
				return true;
			}
			const { product } = context;
			if (product?.has_unlimited_stock) {
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
			if (product?.has_unlimited_stock) {
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
			const { mode, formId, product } = context;
			try {
				context.busy = true;

				const checkout = await addCheckoutLineItem(state.lineItem);
				checkoutActions.setCheckout(checkout, mode, formId);
				cartActions.toggle();

				// speak the cart dialog state.
				cartState.label = sprintf(
					/* translators: %s: product name */
					__('%s has been added to your cart.', 'surecart'),
					product?.name
				);
			} catch (e) {
				console.error(e);
			} finally {
				context.busy = false;
			}
		},
	},

	callbacks: {
		*init() {
			// maybe import analytics handlers.
			if (window?.dataLayer || window?.gtag) {
				yield import(
					/* webpackIgnore: true */
					'@surecart/google-events'
				);
			}

			if (window?.fbq) {
				yield import(
					/* webpackIgnore: true */
					'@surecart/facebook-events'
				);
			}

			const { selectedPrice, product } = getContext();
			scProductViewed(product, selectedPrice, state.quantity);
		},

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
		setOption: (e) => {
			e.preventDefault();

			const {
				variantValues,
				optionNumber,
				option_value,
				option_name,
				option_name_slug,
				option_value_slug,
				urlPrefix,
			} = getContext();

			// get the value.
			const value = option_value || e?.target?.value;

			// first we set the option to optimistically update all the ui.
			variantValues[`option_${optionNumber}`] = value;

			// if we have the name and value, update the url.
			if (!option_value || !option_name) {
				return;
			}

			window.history.replaceState(
				{},
				'',
				addQueryArgs(window.location.href, {
					[`${urlPrefix ? urlPrefix + '-' : ''}${option_name_slug}`]:
						option_value_slug,
				})
			);
		},

		/**
		 * Set the price
		 */
		setPrice: (e) => {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e?.preventDefault();

			const context = getContext();
			const { price, prices } = context;
			const selectedPrice = (prices || []).find(
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
			speak(`Quantity set to ${context.quantity}`, 'polite');
		},

		/**
		 * Handle the quantity decrease.
		 */
		onQuantityDecrease: (e) => {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e?.preventDefault();

			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity = Math.max(1, state.quantity - 1);

			speak(`Quantity set to ${context.quantity}`, 'polite');
		},

		/**
		 * Handle the quantity increase.
		 */
		onQuantityIncrease: (e) => {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e?.preventDefault();

			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity =
				Math.min(state.maxQuantity, state.quantity + 1) || 1;

			speak(`Quantity set to ${context.quantity}`, 'polite');
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
 * Is this variant option sold out.
 */
export const isProductVariantOptionSoldOut = (
	optionNumber,
	option,
	variantValues,
	variants = [],
	product
) => {
	// product stock is not enabled or out of stock purchases are allowed.
	if (product?.has_unlimited_stock) return false;

	// if this is option 1, check to see if there are any variants with this option.
	if (optionNumber === 1) {
		const items = (variants || []).filter?.(
			(variant) => variant.option_1 === option
		);
		const highestStock = Math.max(
			...items.map((item) => item.available_stock)
		);
		return highestStock <= 0;
	}

	// if this is option 2, check to see if there are any variants with this option and option 1
	if (optionNumber === 2) {
		const items = (variants || []).filter(
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
	const items = (variants || []).filter(
		(variant) =>
			variant?.option_1 === variantValues.option_1 &&
			variant?.option_2 === variantValues.option_2 &&
			variant.option_3 === option
	);
	const highestStock = Math.max(...items.map((item) => item.available_stock));
	return highestStock <= 0;
};
