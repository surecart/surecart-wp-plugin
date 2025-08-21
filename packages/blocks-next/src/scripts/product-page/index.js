/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
const { actions: checkoutActions } = store('surecart/checkout');
const { actions: cartActions, state: cartState } = store('surecart/cart');
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.
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
				return {};
			}
			const { variants, variantValues } = context;
			return variantValues
				? getVariantFromValues({
						variants: variants,
						values: variantValues || {},
				  })
				: {};
		},

		get selectedVariantImage() {
			const context = getContext();
			if (!context) {
				return {};
			}

			const image = !!state.selectedVariant?.line_item_image?.src
				? state.selectedVariant.line_item_image
				: context.product?.preview_image || {};

			// Compatibility with lazy loading enabled images.
			return {
				...image,
				src: image?.['data-src'] || image?.src,
				srcset: image?.['data-srcset'] || image?.srcset,
				sizes: image?.['data-sizes'] || image?.sizes,
			};
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
			return selectedPrice?.is_on_sale || false;
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
			const { variants } = context;
			if (!variants?.length) {
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
			const { checkoutUrl } = getContext();
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
			const { buttonText, outOfStockText, unavailableText } = context;
			if (state.isSoldOut) {
				return outOfStockText;
			}
			if (state.isUnavailable) {
				return unavailableText;
			}
			return buttonText;
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
			const { adHocAmount, selectedPrice, lineItemNote } = getContext();
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
				note: lineItemNote || '',
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
			return state.isQuantityDisabled;
		},

		/**
		 * Is quantity decrease disabled?
		 */
		get isQuantityDecreaseDisabled() {
			return state.isQuantityDisabled || state.quantity <= 1;
		},
	},

	actions: {
		*addToCart(e) {
			const hasContextBusy = Object.values(e.submitter.dataset).includes(
				'context.busy'
			);

			// no busy context, toggle cart right away.
			!hasContextBusy && cartActions.open();

			const context = getContext();
			const { mode, formId, product } = context;
			try {
				context.busy = true;

				const { addCheckoutLineItem } = yield import(
					/* webpackIgnore: true */
					'@surecart/checkout-service'
				);

				const checkout = yield* addCheckoutLineItem(state.lineItem);
				checkoutActions.setCheckout(checkout, mode, formId);

				// Reset the line item note in context.
				context.lineItemNote = '';

				// no busy context, wait to toggle cart
				hasContextBusy && cartActions.open();

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
		*handleSubmit(e) {
			e.preventDefault(); // prevent the form from submitting.
			e.stopPropagation(); // prevent the event from bubbling up.

			// if the button hdoes not have a value, add to cart.
			if (!e?.submitter?.value) {
				return yield actions.addToCart(e);
			}
			// otherwise, redirect to the provided url.
			return window.location.assign(e.submitter.value);
		},

		/**
		 * Set the option.
		 */
		setOption: (e) => {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e.preventDefault();

			// Get context values and option data
			const { variantValues, optionNumber, urlPrefix } = getContext();

			// get data from select element or context.
			let optionData = e?.target?.selectedOptions?.[0]?.dataset?.wpContext
				? JSON.parse(
						e?.target?.selectedOptions?.[0]?.dataset?.wpContext
				  )
				: getContext();

			const {
				option_value,
				option_name,
				option_value_slug,
				option_name_slug,
			} = optionData;

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
		 * Set the line item note.
		 */
		setLineItemNote: (e) => {
			const context = getContext();
			context.lineItemNote = e.target.value;
		},

		/**
		 * Redirect to the checkout page if the form is valid.
		 */
		redirectToCheckout: (e) => {
			e?.preventDefault();
			const form = e?.target?.closest('form');
			if (form && !form.checkValidity()) {
				form.reportValidity();
			} else {
				window.location.assign(state.checkoutUrl);
			}
		},

		/**
		 * Handle the quantity change.
		 */
		onQuantityChange: function* (e) {
			const context = getContext();
			context.quantity = Math.max(parseInt(e.target.value), 1);
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);

			speak(`Quantity set to ${context.quantity}`, 'polite');
		},

		/**
		 * Handle the quantity decrease.
		 */
		onQuantityDecrease: function* (e) {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e?.preventDefault();

			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity = Math.max(1, state.quantity - 1);

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);

			speak(`Quantity set to ${context.quantity}`, 'polite');
		},

		/**
		 * Handle the quantity increase.
		 */
		onQuantityIncrease: function* (e) {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e?.preventDefault();

			const context = getContext();
			context.quantity = state.quantity + 1;

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@surecart/a11y'
			);

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
