export const DATE_ATTRIBUTES = [
	'created_at',
	'customer.created_at',
	'products.created_at',
	'price.created_at',
	'product.created_at',
];

export const PRICE_ATTRIBUTES = ['subtotal_amount', 'checkout.subtotal_amount'];

export const TEXT_ATTRIBUTES = [
	'products.name',
	'customer.first_name',
	'note',
	'customer.last_name',
	'price.name',
	'product.name',
	'product.sku',
	'product.slug',
	'product_collection.name',
	'product_collection.slug',
	'product_group.name',
	'checkout.metadata',
	'price.metadata',
	'product.metadata',
	'product_collection.metadata',
	'product_group.metadata',
	'checkout.order_type',
	'price.recurring_interval',
	'price.type',
];

export const EMAIL_ATTRIBUTES = ['customer.email'];

export const NUMBER_ATTRIBUTES = [
	'quantity',
	'customer.orders_count',
	'price.recurring_count',
	'price.recurring_period_count',
];

export const SCHEMA_ID = 'auto_fees__line_item';
