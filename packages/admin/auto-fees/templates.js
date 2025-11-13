import { __ } from '@wordpress/i18n';

export default {
	start_blank: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		name: __('Start from Scratch', 'surecart'),
		percent_adjustment: 50.0,
		description: __(
			'Start from scratch and create your own dynamic price.',
			'surecart'
		),
		icon: 'file',
	},
	bogo: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		fee_target: 'line_item',
		name: __('Buy‑One‑Get‑One (BOGO)', 'surecart'),
		percent_adjustment: 50.0,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'quantity',
							operator_label: 'is',
							comparison_value: '2',
						},
					],
				},
			],
		},
		description: __('Buy 1, get the 2nd one for free.', 'surecart'),
		icon: 'tags',
	},
	free_shipping: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		fee_target: 'shipping',
		name: __('Free‑shipping minimum', 'surecart'),
		percent_adjustment: 100,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'subtotal_amount',
							operator_label: 'is_at_least',
							comparison_value: '7500.00',
						},
					],
				},
			],
		},
		description: __(
			'Free shipping when the subtotal is at least $75.',
			'surecart'
		),
		icon: 'package-check',
	},
	installment_payment_processing_fee: {
		enabled: false,
		amount_adjustment: null,
		discount: false,
		fee_target: 'line_item',
		name: __('Installment‑Payment Processing Fee', 'surecart'),
		percent_adjustment: 3,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'price.price_type',
							operator_label: 'is',
							comparison_value: 'finite_recurring',
						},
					],
				},
			],
		},
		description: __(
			'3% processing fee for installment payments.',
			'surecart'
		),
		icon: 'credit-card',
	},
	subscription_renewal_discount: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		fee_target: 'line_item',
		name: __('Subscription Renewal Discount', 'surecart'),
		percent_adjustment: 15,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'checkout.order.order_type',
							operator_label: 'is',
							comparison_value: 'subscription',
						},
					],
				},
			],
		},
		description: __('15% discount for subscription renewals.', 'surecart'),
		icon: 'hand-coins',
	},
	bulk_purchase_discount: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		fee_target: 'line_item',
		name: __('Bulk‐purchase discount', 'surecart'),
		percent_adjustment: 10.0,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'quantity',
							operator_label: 'is_at_least',
							comparison_value: '5',
						},
					],
				},
			],
		},
		description: __('10% discount for bulk purchases.', 'surecart'),
		icon: 'refresh-cw',
	},
	member_only_discount: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		fee_target: 'checkout',
		name: __('Member-only discounts', 'surecart'),
		percent_adjustment: 5,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'wp_user_role',
							operator_label: 'is',
							comparison_value: 'administrator',
						},
					],
				},
			],
		},
		description: __('5% discount for members only.', 'surecart'),
		icon: 'users',
	},
	first_time_customer_discount: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		fee_target: 'checkout',
		name: __('First‑time customer discount', 'surecart'),
		percent_adjustment: 15,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'customer.order_count',
							operator_label: 'is',
							comparison_value: '0',
						},
					],
				},
			],
		},
		description: __('15% discount for first time customers.', 'surecart'),
		icon: 'gift',
	},
};
