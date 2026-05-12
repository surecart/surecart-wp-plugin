/**
 * WordPress dependencies.
 */
import {
	store,
	getContext,
	getElement,
	withSyncEvent,
} from '@wordpress/interactivity';

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
			const {
				buttonText,
				outOfStockText,
				unavailableText,
				selectComponentOptionsText,
			} = context;
			if (state.isSoldOut || state.isBundleComponentSoldOut) {
				return outOfStockText;
			}
			if (state.isBundleIncomplete) {
				return selectComponentOptionsText || buttonText;
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
				!!(variants?.length && !state.selectedVariant?.id) || // no selected variant.
				!!state.isBundleIncomplete || // bundle has variable components still unselected.
				!!state.isBundleComponentSoldOut // a chosen bundle component variant is sold out.
			);
		},

		/**
		 * Bundle PDP: any variable component that still has no selection
		 * blocks Add to cart. See ProductPageBlock::context() for the seed
		 * list of variable component product IDs.
		 */
		get isBundleIncomplete() {
			const context = getContext();
			if (!context) return false;
			const variableIds = context.bundleVariableComponentIds || [];
			if (!variableIds.length) return false;
			const selections = context.bundleComponentVariants || {};
			return variableIds.some((id) => !selections?.[id]);
		},

		/**
		 * Bundle PDP: a non-variable component is sold out, OR the shopper
		 * has picked a variant for a component and that variant is sold out.
		 * Sourced from ProductPageBlock::getBundleComponents().
		 */
		get isBundleComponentSoldOut() {
			const context = getContext();
			if (!context) return false;
			const components = context.bundleComponents || {};
			const ids = Object.keys(components);
			if (!ids.length) return false;
			const selections = context.bundleComponentVariants || {};

			return ids.some((id) => {
				const info = components[id];
				if (!info || info.has_unlimited_stock) return false;

				const variants = info.variants || [];
				if (variants.length) {
					const chosenId = selections[id];
					if (!chosenId) return false;
					const chosen = variants.find((v) => v.id === chosenId);
					return chosen && (chosen.available_stock || 0) <= 0;
				}

				return (info.available_stock || 0) <= 0;
			});
		},

		/**
		 * Bundle pill: is this option_value currently selected in its
		 * component? Scoped to bundle-item-variant block's nested context.
		 */
		get isBundleComponentOptionSelected() {
			const context = getContext();
			if (!context) return false;
			const { optionNumber, option_value, componentOptionValues } =
				context;
			if (!optionNumber || option_value == null) return false;
			return (
				componentOptionValues?.[`option_${optionNumber}`] ===
				option_value
			);
		},

		/**
		 * Bundle pill: Shopify-style sold-out marker. Stays visible but
		 * marks the pill as unavailable so the shopper sees the full
		 * variant matrix.
		 */
		get isBundleComponentOptionUnavailable() {
			const context = getContext();
			if (!context) return false;
			if (context.componentHasUnlimitedStock) return false;

			const {
				optionNumber,
				option_value,
				componentOptionValues,
				componentVariants,
			} = context;
			if (!optionNumber || option_value == null) return false;
			const optionKey = `option_${optionNumber}`;

			// Constrain by earlier options the shopper has already picked.
			const matching = (componentVariants || []).filter((v) => {
				for (let i = 1; i < optionNumber; i++) {
					const prevKey = `option_${i}`;
					const prevVal = componentOptionValues?.[prevKey];
					if (!prevVal) continue;
					if (v[prevKey] !== prevVal) return false;
				}
				return v[optionKey] === option_value;
			});

			if (!matching.length) return true;
			return (
				Math.max(...matching.map((v) => v.available_stock || 0)) <= 0
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
			const {
				adHocAmount,
				selectedPrice,
				note,
				noteLabel,
				bundleComponentVariants,
			} = getContext();

			// Filter the bundle variant map to ID values only — context may
			// hold a stdClass-shaped object server-side hydrated as {}.
			const componentVariants = Object.entries(
				bundleComponentVariants || {}
			).reduce((acc, [k, v]) => {
				if (v) acc[k] = v;
				return acc;
			}, {});

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
				note:
					!!noteLabel && !!note
						? `${noteLabel}: ${note}`
						: note || '',
				...(state.selectedVariant?.id
					? { variant: state.selectedVariant?.id }
					: {}),
				...(Object.keys(componentVariants).length
					? { bundle_component_variants: componentVariants }
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
		handleSubmit: withSyncEvent(function* (e) {
			if (e.type === 'keydown' && e.key !== 'Enter') {
				return true;
			}

			e.preventDefault(); // prevent the form from submitting.
			e.stopPropagation(); // prevent the event from bubbling up.

			// Add submitter to event if it doesn't exist (for non-form elements)
			if (!e.submitter) {
				const { ref } = getElement();
				if (ref) {
					e.submitter = ref;
				}
			}

			// if the button does not have a value, add to cart.
			if (!e?.submitter?.value) {
				return yield actions.addToCart(e);
			}

			// otherwise, redirect to the provided url.
			return window.location.assign(e.submitter.value);
		}),

		/**
		 * Set the option.
		 */
		setOption: withSyncEvent((e) => {
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
		}),

		setBundleComponentOption: withSyncEvent((e) => {
			if (isNotKeySubmit(e)) return true;
			e.preventDefault();

			const ctx = getContext();
			const {
				optionNumber,
				option_value,
				option_name_slug,
				option_value_slug,
				componentOptionValues,
				componentVariants,
				componentProductId,
				bundleComponentVariants,
				product,
				urlPrefix,
			} = ctx;

			if (!optionNumber || option_value == null) return;

			componentOptionValues[`option_${optionNumber}`] = option_value;

			const variant = getVariantFromValues({
				variants: componentVariants || [],
				values: componentOptionValues || {},
			});

			if (componentProductId) {
				if (variant?.id) {
					bundleComponentVariants[componentProductId] = variant.id;
				} else {
					delete bundleComponentVariants[componentProductId];
				}
			}

			if (componentProductId && option_name_slug && option_value_slug) {
				const key = `${
					urlPrefix ? urlPrefix + '-' : ''
				}bundle-${componentProductId}-${option_name_slug}`;
				window.history.replaceState(
					{},
					'',
					addQueryArgs(window.location.href, {
						[key]: option_value_slug,
					})
				);
			}

			// Bridge to the Stencil product store (legacy buy-button path).
			try {
				const stencilState = window.surecart?.product?.state;
				const bundleId = product?.id;
				if (stencilState && bundleId) {
					stencilState[bundleId] = stencilState[bundleId] || {};
					stencilState[bundleId].bundleComponentVariants = {
						...bundleComponentVariants,
					};
				}
			} catch (err) {
				// non-fatal — next-gen path already has the data.
			}
		}),

		/**
		 * Set the price
		 */
		setPrice: withSyncEvent((e) => {
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
		}),

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
			context.note = e.target.value || '';
			context.noteLabel = context.label || '';
		},

		/**
		 * Expand the product line item note textarea when clicked or focused.
		 */
		expandLineItemNote: (e) => {
			const context = getContext();
			context.rows = 3;
		},

		/**
		 * Redirect to the checkout page if the form is valid.
		 */
		redirectToCheckout: withSyncEvent((e) => {
			e?.preventDefault();
			const form = e?.target?.closest('form');
			if (form && !form.checkValidity()) {
				form.reportValidity();
			} else {
				window.location.assign(state.checkoutUrl);
			}
		}),

		/**
		 * Handle the quantity change.
		 */
		onQuantityChange: function* (e) {
			const context = getContext();
			context.quantity = Math.max(parseInt(e.target.value), 1);
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);

			speak(`Quantity set to ${context.quantity}`, 'polite');
		},

		/**
		 * Handle the quantity decrease.
		 */
		onQuantityDecrease: withSyncEvent(function* (e) {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e?.preventDefault();

			const context = getContext();
			if (state.isQuantityDisabled) return;
			context.quantity = Math.max(1, state.quantity - 1);

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);

			speak(`Quantity set to ${context.quantity}`, 'polite');
		}),

		/**
		 * Handle the quantity increase.
		 */
		onQuantityIncrease: withSyncEvent(function* (e) {
			if (isNotKeySubmit(e)) {
				return true;
			}

			e?.preventDefault();

			const context = getContext();
			context.quantity = state.quantity + 1;

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);

			speak(`Quantity set to ${context.quantity}`, 'polite');
		}),
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
