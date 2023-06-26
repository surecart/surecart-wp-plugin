// our entity query data.
const expand = [
	'line_items',
	'line_item.price',
	'line_item.fees',
	'price.product',
	'customer',
	'customer.shipping_address',
	'payment_intent',
	'discount',
	'discount.promotion',
	'discount.coupon',
	'shipping_address',
	'tax_identifier',
	'manual_payment_method',
];

export default expand;
