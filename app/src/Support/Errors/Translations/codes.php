<?php
/**
 * Code translations
 *
 * @package CheckoutEngine
 */

return [
	'http_request_failed'                          => __( 'Could not complete the request. Please try again.', 'checkout_engine' ),
	'coupon.invalid'                               => __( 'Failed to save coupon.', 'checkout_engine' ),
	'price.dependent_locked'                       => __( 'The price is already being used in subscriptions or checkout sessions. Please archive the price and create another one.', 'checkout_engine' ),
	'order.discount.promotion_code.invalid_code'   => __( 'Invalid promotion code.', 'checkout_engine' ),
	'order.invalid'                                => __( 'Failed to update. Please check for errors and try again.', 'checkout_engine' ),
	'order.line_items.required'                    => __( 'Please add at least one product.', 'checkout-engine' ),
	'order.shipping_address.missing_tax_info'      => __( 'Please fill out your address.', 'checkout-engine' ),
	'refund.amount.greater_than_refundable_amount' => __( 'The refund amount is greater than the refundable amount.', 'checkout-engine' ),
	'subscription.product.one_time'                => __( 'You cannot add a one-time product to a subscription.', 'checkout-engine' ),
	'price.currency.taken'                         => __( 'A price with this currency and recurring interval already exists. Please create a new product to create this price.', 'checkout-engine' ),
	'promotion.code.taken'                         => __( 'This promotion code already exists. Please archive the old code or use a different code.', 'checkout-engine' ),
	'product.restrict_dependent_destroy.has_many'  => __( 'This product has prices that are currently being used. Please archive the product instead.', 'checkout-engine' ),
];
