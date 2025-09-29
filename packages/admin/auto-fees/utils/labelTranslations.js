import { __ } from '@wordpress/i18n';

export const attributeLabels = {
	// Basic attributes
	note: __('Note', 'surecart'),
	quantity: __('Quantity', 'surecart'),
	subtotal_amount: __('Subtotal Amount', 'surecart'),
	wp_user_role: __('WordPress User Role', 'surecart'),

	// Checkout attributes
	'checkout.email': __('Checkout Email', 'surecart'),
	'checkout.email_domain': __('Checkout Email Domain', 'surecart'),
	'checkout.first_name': __('Checkout First Name', 'surecart'),
	'checkout.last_name': __('Checkout Last Name', 'surecart'),
	'checkout.metadata': __('Checkout Metadata', 'surecart'),
	'checkout.order.order_type': __('Checkout Order Type', 'surecart'),
	'checkout.subtotal_amount': __('Checkout Subtotal Amount', 'surecart'),

	// Customer attributes
	'customer.created_at': __('Customer Created At', 'surecart'),
	'customer.order_count': __('Customer Order Count', 'surecart'),

	// Price attributes
	'price.created_at': __('Price Created At', 'surecart'),
	'price.metadata': __('Price Metadata', 'surecart'),
	'price.name': __('Price Name', 'surecart'),
	'price.price_type': __('Price Type', 'surecart'),
	'price.recurring_interval': __('Price Recurring Interval', 'surecart'),
	'price.recurring_period_count': __(
		'Price Recurring Period Count',
		'surecart'
	),

	// Product attributes
	'product.created_at': __('Product Created At', 'surecart'),
	'product.metadata': __('Product Metadata', 'surecart'),
	'product.name': __('Product Name', 'surecart'),
	'product.sku': __('Product SKU', 'surecart'),
	'product.slug': __('Product Slug', 'surecart'),

	// Product collections attributes
	'product.product_collections.metadata': __(
		'Product Collection Metadata',
		'surecart'
	),
	'product.product_collections.name': __(
		'Product Collection Name',
		'surecart'
	),
	'product.product_collections.slug': __(
		'Product Collection Slug',
		'surecart'
	),

	// Product group attributes
	'product.product_group.metadata': __('Product Group Metadata', 'surecart'),
	'product.product_group.name': __('Product Group Name', 'surecart'),
};
