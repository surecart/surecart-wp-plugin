import { __, sprintf } from '@wordpress/i18n';

export const TARGETS = [
	{
		id: 'checkout',
		label: __('Checkout', 'surecart'),
		feeKey: 'negative_checkout_fee_selection_strategy',
		discountKey: 'positive_checkout_fee_selection_strategy',
	},
	{
		id: 'line_item',
		label: __('Line Item', 'surecart'),
		feeKey: 'negative_line_item_fee_selection_strategy',
		discountKey: 'positive_line_item_fee_selection_strategy',
	},
	{
		id: 'shipping',
		label: __('Shipping', 'surecart'),
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

export const STRATEGY_VALUES = ['all', 'first', 'biggest', 'lowest'];

export const VALUE_PHRASE = {
	all: __('All applicable %ss', 'surecart'),
	first: __('The first applicable %s', 'surecart'),
	biggest: __('The biggest applicable %s', 'surecart'),
	lowest: __('The lowest applicable %s', 'surecart'),
};

export const TARGET_PHRASE = {
	checkout: __('at checkout', 'surecart'),
	line_item: __('to the line item', 'surecart'),
	shipping: __('to shipping', 'surecart'),
};

export const HELP_TEXT_STYLE = {
	opacity: '0.85',
	color: 'var(--sc-color-gray-500)',
	fontSize: 'var(--sc-font-size-small)',
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
