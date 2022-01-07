<?php
/**
 * Type translations
 *
 * @package CheckoutEngine
 */

return [
	'invalid_code'             => __( 'Invalid.', 'checkout_engine' ),
	'invalid'                  => __( 'There were some validation errors.', 'checkout_engine' ),
	'empty'                    => __( "Can't be empty.", 'checkout_engine' ),
	'blank'                    => __( "Can't be blank.", 'checkout_engine' ),
	'present'                  => __( 'Must be blank', 'checkout_engine' ),
	'not_found'                => __( 'Not found.', 'checkout_engine' ),
	'not_a_number'             => __( 'Not a number', 'checkout_engine' ),
	'not_an_integer'           => __( 'Must be an integer', 'checkout_engine' ),
	'model_invalid'            => __( 'Validation failed', 'checkout_engine' ),
	'inclusion'                => __( 'This is not included in the list.', 'checkout_engine' ),
	'exclusion'                => __( 'This is reserved.', 'checkout_engine' ),
	'confirmation'             => __( "This doesn't match", 'checkout_engine' ),
	'accepted'                 => __( 'Must be accepted.', 'checkout_engine' ),
	'too_long'                 => __( 'Too long.', 'checkout_engine' ),
	'too_short'                => __( 'Too short.', 'checkout_engine' ),
	'greater_than'             => __( 'Must be larger.', 'checkout_engine' ),
	'greater_than_or_equal_to' => __( 'Must be larger.', 'checkout_engine' ),
	'less_than'                => __( 'Must be smaller.', 'checkout_engine' ),
	'less_than_or_equal_to'    => __( 'Must be smaller.', 'checkout_engine' ),
	'wrong_length'             => __( 'Wrong length.', 'checkout_engine' ),
	'odd'                      => __( 'Must be odd', 'checkout_engine' ),
	'even'                     => __( 'Must be even', 'checkout_engine' ),
	'archived'                 => __( 'It is archived.', 'checkout_engine' ),
	'currency_mismatch'        => __( 'It does not match parent currency.', 'checkout_engine' ),
	'expired'                  => __( 'It is expired.', 'checkout_engine' ),
	'invalid_processor'        => __( 'It is not valid or enabled.', 'checkout_engine' ),
	'hex_color_format'         => __( 'It is not a valid hex color.', 'checkout_engine' ),
	'multiple_active'          => __( 'Only one active abandoned checkout is allowed at a time', 'checkout_engine' ),
	'send_after.too_soon'      => __( 'must be 15 minutes or more', 'checkout_engine' ),
	'send_after.too_late'      => __( 'must be less than 1 week', 'checkout_engine' ),
	'send_after.too_close'     => __( 'must be at least 12 hours between emails', 'checkout_engine' ),
	'send_after.too_many'      => __( 'max count reached', 'checkout_engine' ),
];


// en:
// activerecord:
// errors:
// messages:
// archived: "is archived"
// currency_mismatch: "does not match parent currency"
// expired: "is expired"
// invalid_processor: "not valid or enabled"
// hex_color_format: "is not a valid hex color"
// models:
// abandoned_checkout:
// attributes:
// customer:
// multiple_active: is only allowed one active abandoned checkout at a time
// abandonment_notification_template:
// attributes:
// send_after:
// too_soon: must be 15 minutes or more
// too_late: must be less than 1 week
// too_close: must be at least 12 hours between emails
// too_many: max count reached
// account_user:
// attributes:
// admin:
// cannot_be_removed: "role cannot be removed for the account owner"
// api_token:
// attributes:
// mode:
// not_enabled: "not enabled in this environment"
// order:
// paid_locked: "can't delete when status is 'paid'"
// attributes:
// line_items:
// stale_prices: one or more line items have stale price references
// coupon:
// conflicting_strategy: "only one of 'amount_off' or 'percent_off' can be set"
// discount:
// attributes:
// promotion:
// coupon_mismatch: "does not belong to coupon"
// promotion_code:
// invalid_code: "invalid code"
// line_item:
// attributes:
// ad_hoc_amount:
// outside_range: "must be between %{min} and %{max}"
// price:
// dependent_locked: "has dependent line items or subscriptions"
// attributes:
// ad_hoc:
// recurring: "can't be true when recurring is true"
// recurring_interval_count:
// max_interval: "must be less than or equal to 1 year"
// subscription_item:
// attributes:
// price:
// one_time: "must be recurring"
// webhook_endpoint:
// attributes:
// mode:
// not_enabled: "not enabled in this environment"
