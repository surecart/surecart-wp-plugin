/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
import { formatCurrency } from '@surecart/currency';
import { intervalString } from '@surecart/price';

// TODO: switch to @wordpress/i18n once it's supported in modules.
const { __, sprintf, _n } = wp.i18n;

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
		get selectedPriceAmount() {
			return (
				state?.selectedVariant?.amount ||
				state?.selectedPrice?.amount ||
				0
			);
		},
		get selectedScratchPriceAmount() {
			// no scratch amount.
			if (!state?.selectedPrice?.scratch_amount) {
				return false;
			}
			// if the scratch amount is the same as the selected price amount, return false.
			if (
				state?.selectedPrice?.scratch_amount <=
				state?.selectedPriceAmount
			) {
				return null;
			}
			return state?.selectedPrice?.scratch_amount;
		},
		get selectedPriceDisplayAmount() {
			return formatCurrency(
				state.selectedPriceAmount,
				state.product.currency
			);
		},
		get selectedScratchPriceDisplayAmount() {
			return formatCurrency(
				state.selectedScratchPriceAmount,
				state.product.currency
			);
		},
		get isOnSale() {
			return !!state.selectedScratchPriceAmount;
		},
		get setupFeeDisplayAmount() {
			return state.selectedPrice?.setup_fee_enabled
				? formatCurrency(
						state.selectedPrice?.setup_fee_amount,
						state.product.currency
				  )
				: null;
		},
		get setupFeeDisplayText() {
			return state.setupFeeDisplayAmount
				? sprintf(
						__('%1s %2s.', 'surecart'),
						state?.setupFeeDisplayAmount,
						state?.selectedPrice?.setup_fee_name ||
							__('Setup Fee', 'surecart')
				  )
				: null;
		},
		get trialDisplayText() {
			return state.selectedPrice?.trial_duration_days
				? sprintf(
						_n(
							'Starting in %s day.',
							'Starting in %s days.',
							state.selectedPrice?.trial_duration_days,
							'surecart'
						),
						state.selectedPrice?.trial_duration_days
				  )
				: null;
		},
		get intervalDisplayText() {
			return intervalString(
				{
					recurring_interval_count:
						state.selectedPrice?.recurring_interval_count,
					recurring_interval: state.selectedPrice?.recurring_interval,
					recurring_period_count:
						state.selectedPrice?.recurring_period_count,
				},
				{
					showOnce: true,
					abbreviate: false,
					labels: {
						interval: '/',
						period:
							/** translators: used as in time period: "for 3 months" */
							__('for', 'surecart'),
					},
				}
			);
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
		/** Get the selected option. */
		get getSelectedOption() {
			const { optionNumber } = getContext();
			return state.variantValues[`option_${optionNumber}`];
		},
		/** Line item to add to cart. */
		get lineItem() {
			return {
				price_id: state?.selectedPrice?.id,
				quantity: state?.quantity || 1,
				...(state?.selectedPrice?.ad_hoc
					? { ad_hoc_amount: state?.selectedPrice?.amount }
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
		setVariantValues: () => {
			update({
				variantValues: {
					...(state?.selectedVariant?.option_1
						? { option_1: state?.selectedVariant?.option_1 }
						: {}),
					...(state?.selectedVariant?.option_2
						? { option_2: state?.selectedVariant?.option_2 }
						: {}),
					...(state?.selectedVariant?.option_3
						? { option_3: state?.selectedVariant?.option_3 }
						: {}),
				},
			});
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
