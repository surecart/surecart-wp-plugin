import { __ } from '@wordpress/i18n';

export default {
	start_blank: {
		enabled: false,
		amount_adjustment: null,
		discount: true,
		fee_target: 'line_item',
		name: __('New Blank Dynamic Price', 'surecart'),
		percent_adjustment: 50.0,
	},
	bogo: {
		enabled: true,
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
	},
	free_shipping: {
		enabled: true,
		amount_adjustment: null,
		discount: true,
		fee_target: 'shipping',
		name: __('Free‑shipping threshold', 'surecart'),
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
	},

	installment_payment_processing_fee: {
		enabled: true,
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
	},
	subscription_renewal_discount: {
		enabled: true,
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
	},
	bulk_purchase_discount: {
		enabled: true,
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
	},
	member_only_discount: {
		enabled: true,
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
	},
	first_time_customer_discount: {
		enabled: true,
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
	},
};
