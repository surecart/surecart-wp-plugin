import { __ } from '@wordpress/i18n';

export const DATE_ATTRIBUTES = [
	'customer.created_at',
	'price.created_at',
	'product.created_at',
];

export const PRICE_ATTRIBUTES = [
	'subtotal_amount',
	'checkout.subtotal_amount',
	'shipping_amount',
];

export const TEXT_ATTRIBUTES = [
	'note',
	'first_name',
	'last_name',
	'email_domain',
	'metadata',
	'checkout.metadata',
	'checkout.email_domain',
	'checkout.first_name',
	'checkout.last_name',
	'checkout.order.order_type',
	'price.metadata',
	'price.name',
	'price.recurring_interval',
	'price.price_type',
	'product.metadata',
	'product.name',
	'product.sku',
	'product.slug',
	'product.product_collections.metadata',
	'product.product_collections.name',
	'product.product_collections.slug',
	'product.product_group.metadata',
	'product.product_group.name',
	'selected_shipping_method.name',
	'order.order_type',
];

export const EMAIL_ATTRIBUTES = ['email', 'checkout.email'];

export const NUMBER_ATTRIBUTES = [
	'quantity',
	'line_item_quantity',
	'g_weight',
	'customer.order_count',
	'price.recurring_period_count',
];

export const USER_ROLE_ATTRIBUTES = ['wp_user_role'];

export const TYPE_CHOICES = [
	{
		label: __('Line Item', 'surecart'),
		value: 'line_item',
		description: __(
			'Apply this dynamic price to a line item that qualifies.',
			'surecart'
		),
		icon: 'layout-list',
	},
	{
		label: __('Checkout', 'surecart'),
		value: 'checkout',
		description: __(
			'Apply this dynamic price to the entire checkout.',
			'surecart'
		),
		icon: 'shopping-cart',
	},
	{
		label: __('Shipping', 'surecart'),
		value: 'shipping',
		description: __(
			'Apply this dynamic price to the shipping cost.',
			'surecart'
		),
		icon: 'truck',
	},
];
