import { __, sprintf } from '@wordpress/i18n';

export const TARGETS = [
	{
		id: 'checkout',
		label: __('Checkout', 'surecart'),
		description: __(
			'Choose the behavior when multiple fees or discounts apply to the order total.',
			'surecart'
		),
		feeKey: 'positive_checkout_fee_selection_strategy',
		discountKey: 'negative_checkout_fee_selection_strategy',
	},
	{
		id: 'line_item',
		label: __('Line Item', 'surecart'),
		description: __(
			'Choose the behavior when multiple fees or discounts apply to individual products in the cart.',
			'surecart'
		),
		feeKey: 'positive_line_item_fee_selection_strategy',
		discountKey: 'negative_line_item_fee_selection_strategy',
	},
	{
		id: 'shipping',
		label: __('Shipping', 'surecart'),
		description: __(
			'Choose the behavior when multiple fees or discounts apply to the shipping total.',
			'surecart'
		),
		feeKey: 'positive_shipping_fee_selection_strategy',
		discountKey: 'negative_shipping_fee_selection_strategy',
	},
];

export const STRATEGY_VALUES = ['all', 'first', 'biggest', 'lowest'];

export const STRATEGY_LABELS = {
	all: __('All', 'surecart'),
	first: __('First', 'surecart'),
	biggest: __('Largest', 'surecart'),
	lowest: __('Smallest', 'surecart'),
};

export const VALUE_PHRASE = {
	/* translators: %s: discount type (e.g. discount, coupon) */
	all: __('All matching %ss', 'surecart'),
	/* translators: %s: discount type (e.g. discount, coupon) */
	first: __('Only the first matching %s', 'surecart'),
	/* translators: %s: discount type (e.g. discount, coupon, fee) */
	biggest: __('Only the biggest matching %s', 'surecart'),
	/* translators: %s: discount type (e.g. discount, coupon, fee) */
	lowest: __('Only the lowest matching %s', 'surecart'),
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
		/* translators: %1$s: strategy value (e.g. all, first, biggest, lowest), %2$s: target (e.g. checkout, line_item, shipping) */
		__('%1$s will be applied %2$s.', 'surecart'),
		sprintf(VALUE_PHRASE[value], type),
		TARGET_PHRASE[target]
	);
};
