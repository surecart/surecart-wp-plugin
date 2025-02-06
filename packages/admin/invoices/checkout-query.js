// our entity query data.
const expand = [
	'line_items',
	'line_item.price',
	'line_item.fees',
	'line_item.variant',
	'price.product',
	'product.featured_product_media',
	'product_media.media',
	'customer',
	'customer.shipping_address',
	'customer.billing_address',
	'payment_intent',
	'discount',
	'discount.promotion',
	'discount.coupon',
	'shipping_address',
	'billing_address',
	'tax_identifier',
	'manual_payment_method',
	'shipping_choices',
	'shipping_choices.shipping_method',
	'order',
	'checkout.payment_method',
	'payment_method.card',
	'checkout.manual_payment_method',
];

export default expand;
