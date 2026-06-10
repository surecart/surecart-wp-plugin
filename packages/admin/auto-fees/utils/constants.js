import { __ } from '@wordpress/i18n';

export const ATTRIBUTE_REGISTRY = {
	date: {
		'customer.created_at': __('Customer Created At', 'surecart'),
		'price.created_at': __('Price Created At', 'surecart'),
		'product.created_at': __('Product Created At', 'surecart'),
	},

	price: {
		subtotal_amount: __('Subtotal Amount', 'surecart'),
		'checkout.subtotal_amount': __('Checkout Subtotal Amount', 'surecart'),
		shipping_amount: __('Shipping Amount', 'surecart'),
	},

	email: {
		email: __('Email', 'surecart'),
		'checkout.email': __('Checkout Email', 'surecart'),
	},

	text: {
		note: __('Note', 'surecart'),
		first_name: __('First Name', 'surecart'),
		last_name: __('Last Name', 'surecart'),
		email_domain: __('Email Domain', 'surecart'),
		metadata: __('Metadata', 'surecart'),

		'checkout.metadata': __('Checkout Metadata', 'surecart'),
		'checkout.email_domain': __('Checkout Email Domain', 'surecart'),
		'checkout.first_name': __('Checkout First Name', 'surecart'),
		'checkout.last_name': __('Checkout Last Name', 'surecart'),
		'checkout.order.order_type': __('Checkout Order Type', 'surecart'),
		'checkout.order_type': __('Checkout Order Type', 'surecart'),

		'price.metadata': __('Price Metadata', 'surecart'),
		'price.name': __('Price Name', 'surecart'),
		'price.recurring_interval': __('Price Recurring Interval', 'surecart'),
		'price.price_type': __('Price Type', 'surecart'),

		'product.metadata': __('Product Metadata', 'surecart'),
		'product.name': __('Product Name', 'surecart'),
		'product.sku': __('Product SKU', 'surecart'),
		'product.slug': __('Product Slug', 'surecart'),

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

		'product.product_group.metadata': __(
			'Upgrade Group Metadata',
			'surecart'
		),
		'product.product_group.name': __('Upgrade Group Name', 'surecart'),

		'selected_shipping_method.name': __(
			'Selected Shipping Method Name',
			'surecart'
		),

		'order.order_type': __('Order Type', 'surecart'),
		order_type: __('Order Type', 'surecart'),
		sku: __('SKU (Product/Variant)', 'surecart'),

		'coupon.name': __('Coupon Name', 'surecart'),
		'promotion.code': __('Promotion Code Name', 'surecart'),
		'checkout.coupon.name': __('Coupon Name', 'surecart'),
		'checkout.promotion.code': __('Promotion Code Name', 'surecart'),
	},

	number: {
		quantity: __('Quantity', 'surecart'),
		line_item_quantity: __('Line Item Quantity', 'surecart'),
		g_weight: __('Weight (g)', 'surecart'),
		'customer.order_count': __('Customer Order Count', 'surecart'),
		'price.recurring_period_count': __(
			'Price Recurring Period Count',
			'surecart'
		),
		customer_prior_product_purchase_quantity: __(
			'Customer Prior Product Purchase Count',
			'surecart'
		),
		'original_checkout.not_revoked_purchases_quantity': __(
			'Original Checkout Not Revoked Purchases Quantity',
			'surecart'
		),
		'original_checkout.billable_purchases_quantity': __(
			'Original Checkout Billable Purchases Quantity',
			'surecart'
		),
	},

	country: {
		'geo_address.country': __('Geo Address Country', 'surecart'),
		'checkout.geo_address.country': __(
			'Checkout Geo Address Country',
			'surecart'
		),
	},

	user_role: {
		wp_user_role: __('WordPress User Role', 'surecart'),
	},

	// Keep in sync with UUID_ENTITY_MAP below.
	uuid: {
		'customer.id': __('Customer', 'surecart'),
		'coupon.id': __('Coupon', 'surecart'),
		'promotion.id': __('Promotion Code', 'surecart'),
		'price.id': __('Price', 'surecart'),
		'product.id': __('Product', 'surecart'),
		'product.product_collections.id': __('Product Collection', 'surecart'),
		'product.product_group.id': __('Upgrade Group', 'surecart'),
		'checkout.coupon.id': __('Coupon', 'surecart'),
		'checkout.promotion.id': __('Promotion Code', 'surecart'),
	},
};

export const { ATTRIBUTE_TYPE_MAP, attributeLabels } = (() => {
	const typeMap = {};
	const labels = {};

	for (const [type, attrs] of Object.entries(ATTRIBUTE_REGISTRY)) {
		for (const [key, label] of Object.entries(attrs)) {
			typeMap[key] = type;
			labels[key] = label;
		}
	}

	return {
		ATTRIBUTE_TYPE_MAP: typeMap,
		attributeLabels: labels,
	};
})();

export const operatorLabels = {
	is: __('is', 'surecart'),
	is_not: __('is not', 'surecart'),
	is_more_than: __('is more than', 'surecart'),
	is_less_than: __('is less than', 'surecart'),
	is_at_least: __('is at least', 'surecart'),
	is_at_most: __('is at most', 'surecart'),
	is_after: __('is after', 'surecart'),
	is_before: __('is before', 'surecart'),
	is_on_or_after: __('is on or after', 'surecart'),
	is_on_or_before: __('is on or before', 'surecart'),
	contains: __('contains', 'surecart'),
	not_contains: __('not contains', 'surecart'),
	start_with: __('starts with', 'surecart'),
	end_with: __('ends with', 'surecart'),
};

export const supportedValuesLabels = {
	checkout: __('Initial Checkout', 'surecart'),
	subscription: __('Renewal & Plan Changes', 'surecart'),
};

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

export const APPLIES_WHILE_CHOICES = [
	{
		label: __('All transactions', 'surecart'),
		value: 'both',
		description: __(
			'Initial checkout, renewals, upgrades, and downgrades.',
			'surecart'
		),
	},
	{
		label: __('Initial checkout', 'surecart'),
		value: 'initial',
		description: __('New purchases only.', 'surecart'),
	},
	{
		label: __('Renewals & plan changes', 'surecart'),
		value: 'renewal',
		description: __('Renewals, upgrades, and downgrades only.', 'surecart'),
	},
];

export const STRING_OPERATORS = ['contains', 'start_with', 'end_with'];

// Keep in sync with ATTRIBUTE_REGISTRY.uuid above.
export const UUID_ENTITY_MAP = {
	'customer.id': 'customer',
	'coupon.id': 'coupon',
	'checkout.coupon.id': 'coupon',
	'promotion.id': 'promotion',
	'checkout.promotion.id': 'promotion',
	'price.id': 'price',
	'product.id': 'product',
	'product.product_collections.id': 'product-collection',
	'product.product_group.id': 'product-group',
};
