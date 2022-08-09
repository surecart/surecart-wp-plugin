<?php
/**
 * Code translations
 *
 * @package SureCart
 */

return [
	'http_request_failed'                               => __( 'Could not complete the request. Please try again.', 'surecart' ),
	'coupon.invalid'                                    => __( 'Failed to save coupon.', 'surecart' ),
	'price.dependent_locked'                            => __( 'The price is already being used in subscriptions or checkout sessions. Please archive the price and create another one.', 'surecart' ),
	'order.discount.promotion_code.invalid_code'        => __( 'Invalid promotion code.', 'surecart' ),
	'order.invalid'                                     => __( 'Failed to update. Please check for errors and try again.', 'surecart' ),
	'order.line_items.required'                         => __( 'Please add at least one product.', 'surecart' ),
	'order.shipping_address.missing_tax_info'           => __( 'Please fill out your address.', 'surecart' ),
	'download.current_release'                          => __( 'This download cannot be removed or archived when it is set as the current release.', 'surecart' ),
	'refund.amount.greater_than_refundable_amount'      => __( 'The refund amount is greater than the refundable amount.', 'surecart' ),
	'subscription.product.one_time'                     => __( 'You cannot add a one-time product to a subscription.', 'surecart' ),
	'price.blank'                                       => __( 'The price cannot be blank.', 'surecart' ),
	'price.currency.taken'                              => __( 'A price with this currency and recurring interval already exists. Please create a new product to create this price.', 'surecart' ),
	'promotion.code.taken'                              => __( 'This promotion code already exists. Please archive the old code or use a different code.', 'surecart' ),
	'payment_intent.processor.blank'                    => __( 'There are no processors to make the payment. Please contact us for assistance.', 'surecart' ),
	'product.restrict_dependent_destroy.has_many'       => __( 'This product has prices that are currently being used. Please archive the product instead if it is not already archived.', 'surecart' ),
	'product.image.invalid_media_type'                  => __( 'The product image must be an image.', 'surecart' ),
	'order.shipping_address.invalid_tax_address'        => __( 'Please fill out your address.', 'surecart' ),
	'order.tax_identifier.invalid_tax_identifier'       => __( 'Please enter a valid tax number.', 'surecart' ),
	'order.line_items.old_price_versions'               => __( 'The prices in this checkout session have changed. Please recheck it before submitting again.', 'surecart' ),
	'order.discount.coupon.blank'                       => __( 'This coupon code is invalid.', 'surecart' ),
	'order.shipping_address.postal_code.invalid'        => __( 'Your postal code is not valid.', 'surecart' ),
	'order.discount.coupon.expired'                     => __( 'This coupon has expired.', 'surecart' ),
	'order.discount.coupon.currency_mismatch'           => __( 'This discount code does not apply to this currency.', 'surecart' ),
	'order_protocol.number_prefix.invalid'              => __( 'Please double-check your prefix does not contain any spaces, underscores, dashes or special characters.', 'surecart' ),
	'order_protocol.number_prefix.too_long'             => __( 'This prefix is too long. Please enter a shorter prefix.', 'surecart' ),
	'order_protocol.number_prefix.too_short'            => __( 'This prefix is too short. Please enter a longer prefix.', 'surecart' ),
	'price_version.restrict_dependent_destroy.has_many' => __( 'This price is currently being used in subscriptions or checkout sessions. Please archive the price and create another one.', 'surecart' ),
	'price.ad_hoc_max_amount.less_than'                 => __( 'The maximum price must be smaller.', 'surecart' ),
	'price.ad_hoc_min_amount.less_than'                 => __( 'The minimum price must be smaller.', 'surecart' ),
	'price.ad_hoc_max_amount.greater_than_or_equal_to'  => __( 'The maximum price must be greater than the minimum price.', 'surecart' ),
	'tax_registration.tax_zone_id.taken'                => __( 'You are already collecting tax for this zone.', 'surecart' ),
	'tax_protocol.eu_micro_exemption_enabled.address_outside_eu' => __( 'You cannot enable EU Micro Exemption if your address is outside of the EU.', 'surecart' ),
	'tax_protocol.tax_enabled.invalid_address'          => __( 'You cannot enable taxes unless a valid tax address is provided', 'surecart' ),
	'media.restrict_dependent_destroy.has_one'          => __( 'You cannot delete this media item because it is currently being used.', 'surecart' ),
];
