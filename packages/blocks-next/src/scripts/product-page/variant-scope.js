/**
 * Check if stock is effectively unlimited for a variant, falling back to product.
 *
 * @param {Object} variant Variant data.
 * @param {Object} product Product data (fallback).
 * @return {boolean} Whether stock is effectively unlimited.
 */
export const hasEffectiveUnlimitedStock = (variant, product) =>
	variant?.has_unlimited_stock ?? product?.has_unlimited_stock ?? false;

/**
 * Find the variant that matches a set of selected option values.
 *
 * @param {Object}        args          Args.
 * @param {Array}         args.variants  Variants to search.
 * @param {Object}        args.values    Selected option values (option_1/2/3).
 * @return {Object|null} The matching variant, or null.
 */
export const getVariantFromValues = ({ variants, values }) => {
	const variantValueKeys = Object.keys(values || {});

	for (const variant of variants) {
		const variantValues = ['option_1', 'option_2', 'option_3']
			.map((option) => variant[option])
			.filter((value) => value !== null && value !== undefined);

		if (
			variantValues?.length === variantValueKeys?.length &&
			variantValueKeys.every((key) => variant[key] === values[key])
		) {
			return variant;
		}
	}
	return null;
};

/**
 * Is a variant option value sold out, constrained by earlier selected options.
 *
 * @param {number}  optionNumber            Which option (1, 2 or 3) the pill is.
 * @param {string}  option                  The pill's option value.
 * @param {Object}  variantValues           Currently selected option values.
 * @param {Array}   variants                Variants for this scope.
 * @param {Object}  product                 Product data for unlimited-stock fallback.
 * @param {boolean} missingMeansUnavailable When true, a combination with no
 *                                          matching variant counts as unavailable.
 * @return {boolean} Whether the option is unavailable.
 */
export const isProductVariantOptionSoldOut = (
	optionNumber,
	option,
	variantValues,
	variants = [],
	product = null,
	missingMeansUnavailable = false
) => {
	const getEffectiveStock = (variant) => {
		if (hasEffectiveUnlimitedStock(variant, product)) return Infinity;
		return variant.available_stock;
	};

	const isGroupSoldOut = (items) => {
		// No variant matches this option combination. On the page product this
		// stays selectable; in a bundle component it means the combo can't be
		// built, so the pill is unavailable.
		if (!items.length) return missingMeansUnavailable;
		return Math.max(...items.map(getEffectiveStock)) <= 0;
	};

	// if this is option 1, check to see if there are any variants with this option.
	if (optionNumber === 1) {
		const items = (variants || []).filter?.(
			(variant) => variant.option_1 === option
		);
		return isGroupSoldOut(items);
	}

	// if this is option 2, check to see if there are any variants with this option and option 1
	if (optionNumber === 2) {
		const items = (variants || []).filter(
			(variant) =>
				variant?.option_1 === variantValues.option_1 &&
				variant.option_2 === option
		);
		return isGroupSoldOut(items);
	}

	// if this is option 3, check to see if there are any variants with all the options.
	const items = (variants || []).filter(
		(variant) =>
			variant?.option_1 === variantValues.option_1 &&
			variant?.option_2 === variantValues.option_2 &&
			variant.option_3 === option
	);
	return isGroupSoldOut(items);
};

/**
 * Resolve the variant scope a pill is operating in.
 *
 * The same picker renders for the page product and for each bundle component.
 * Each scope owns the things that differ — which slice of state it reads/writes,
 * its variant/stock data, how a selection is committed, and how its URL key is
 * built — so callers never branch on "is this a bundle?". Add a new scope here
 * and the call sites (setOption, the option getters) keep working unchanged.
 *
 * @param {Object} ctx Interactivity context for the current pill.
 * @return {{values:Object, variants:Array, product:Object, missingMeansUnavailable:boolean, commit:Function, urlKey:Function}} Scope.
 */
export const getVariantScope = (ctx) => {
	const prefix = ctx?.urlPrefix ? `${ctx.urlPrefix}-` : '';

	// Bundle component: a component product carries the variants; selections are
	// keyed per component in the bundleComponentVariants map.
	if (ctx?.componentProductId) {
		const unlimited = !!ctx.componentHasUnlimitedStock;
		return {
			values: ctx.componentOptionValues || {},
			variants: ctx.componentVariants || [],
			product: { has_unlimited_stock: unlimited },
			// An unmatched combination can't be built unless stock is unlimited.
			missingMeansUnavailable: !unlimited,
			commit(optionNumber, value) {
				if (!ctx.componentOptionValues) ctx.componentOptionValues = {};
				ctx.componentOptionValues[`option_${optionNumber}`] = value;

				if (!ctx.bundleComponentVariants)
					ctx.bundleComponentVariants = {};
				const variant = getVariantFromValues({
					variants: ctx.componentVariants || [],
					values: ctx.componentOptionValues,
				});
				if (variant?.id) {
					ctx.bundleComponentVariants[ctx.componentProductId] =
						variant.id;
				} else {
					delete ctx.bundleComponentVariants[ctx.componentProductId];
				}
			},
			// Namespaced per component so each choice round-trips independently.
			urlKey(optionNameSlug) {
				return `${prefix}bundle-${
					ctx.componentProductSlug || ctx.componentProductId
				}-${optionNameSlug}`;
			},
		};
	}

	// Page product.
	return {
		values: ctx?.variantValues || {},
		variants: ctx?.variants || [],
		product: ctx?.product || null,
		// On the page product an unmatched combination stays selectable.
		missingMeansUnavailable: false,
		commit(optionNumber, value) {
			if (!ctx.variantValues) ctx.variantValues = {};
			ctx.variantValues[`option_${optionNumber}`] = value;

			// Sync variant selection to the Stencil product store (upsell flow).
			if (ctx.product?.id) {
				document.dispatchEvent(
					new CustomEvent('scVariantValuesUpdated', {
						detail: {
							productId: ctx.product.id,
							variantValues: { ...ctx.variantValues },
						},
					})
				);
			}
		},
		urlKey(optionNameSlug) {
			return `${prefix}${optionNameSlug}`;
		},
	};
};
