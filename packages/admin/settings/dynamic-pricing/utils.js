import { __, sprintf } from '@wordpress/i18n';

export const TARGETS = [
	{
		id: 'checkout',
		label: __('Checkout', 'surecart'),
		description: __(
			'Choose the behavior when multiple fees or discounts apply to the order total.',
			'surecart'
		),
		feeKey: 'negative_checkout_fee_selection_strategy',
		discountKey: 'positive_checkout_fee_selection_strategy',
	},
	{
		id: 'line_item',
		label: __('Line Item', 'surecart'),
		description: __(
			'Choose the behavior when multiple fees or discounts apply to individual products in the cart.',
			'surecart'
		),
		feeKey: 'negative_line_item_fee_selection_strategy',
		discountKey: 'positive_line_item_fee_selection_strategy',
	},
	{
		id: 'shipping',
		label: __('Shipping', 'surecart'),
		description: __(
			'Choose the behavior when multiple fees or discounts apply to the shipping total.',
			'surecart'
		),
		feeKey: 'negative_shipping_fee_selection_strategy',
		discountKey: 'positive_shipping_fee_selection_strategy',
	},
];

export const FEE_STRATEGIES = [
	{
		label: __('Checkout', 'surecart'),
		target: 'checkout',
		attribute: 'negative_checkout_fee_selection_strategy',
	},
	{
		label: __('Line Item', 'surecart'),
		target: 'line_item',
		attribute: 'negative_line_item_fee_selection_strategy',
	},
	{
		label: __('Shipping', 'surecart'),
		target: 'shipping',
		attribute: 'negative_shipping_fee_selection_strategy',
	},
];

export const DISCOUNT_STRATEGIES = [
	{
		label: __('Checkout', 'surecart'),
		target: 'checkout',
		attribute: 'positive_checkout_fee_selection_strategy',
	},
	{
		label: __('Line Item', 'surecart'),
		target: 'line_item',
		attribute: 'positive_line_item_fee_selection_strategy',
	},
	{
		label: __('Shipping', 'surecart'),
		target: 'shipping',
		attribute: 'positive_shipping_fee_selection_strategy',
	},
];

export const STRATEGY_VALUES = ['all', 'first', 'largest', 'smallest'];

export const STRATEGY_LABELS = {
	all: __('All', 'surecart'),
	first: __('First', 'surecart'),
	largest: __('Largest', 'surecart'),
	smallest: __('Smallest', 'surecart'),
};

export const VALUE_PHRASE = {
	/* translators: %s: discount type (e.g. discount, coupon) */
	all: __('All matching %ss', 'surecart'),
	/* translators: %s: discount type (e.g. discount, coupon) */
	first: __('Only the first matching %s', 'surecart'),
	/* translators: %s: discount type (e.g. discount, coupon, fee) */
	largest: __('Only the largest matching %s', 'surecart'),
	/* translators: %s: discount type (e.g. discount, coupon, fee) */
	smallest: __('Only the smallest matching %s', 'surecart'),
};

export const TARGET_PHRASE = {
	checkout: __('at checkout', 'surecart'),
	line_item: __('to the line item', 'surecart'),
	shipping: __('to shipping', 'surecart'),
};

export const getHelpText = (
	value = 'all',
	type = 'discount',
	target = 'checkout'
) => {
	if (!VALUE_PHRASE[value] || !TARGET_PHRASE[target]) {
		return '';
	}

	return sprintf(
		__('%s will be applied %s.', 'surecart'),
		sprintf(VALUE_PHRASE[value], type),
		TARGET_PHRASE[target]
	);
};
