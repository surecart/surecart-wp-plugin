<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Concerns\HasBlockTheme;

/**
 * Checkout block
 */
class Form extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'form';

	/**
	 * Register checkout form styles
	 *
	 * @return void
	 */
	public function registerStyles() {
		$this->registerBlockTheme( $this->name, 'elegant', __( 'Elegant', 'checkout_engine' ), 'dist/styles/themes/elegant.css' );
	}

	/**
	 * Get the classes for the block
	 *
	 * @param  array $attributes Block attributes.
	 * @return string
	 */
	public function getClasses( $attributes ) {
		$block_alignment = isset( $attributes['align'] ) ? sanitize_text_field( $attributes['align'] ) : '';
		return ! empty( $block_alignment ) ? 'align' . $block_alignment : '';
	}

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		global $ce_form_id;

		return \CheckoutEngine::blocks()->render(
			"blocks/$this->name",
			[
				'align'       => $attributes['align'] ?? '',
				'label'       => $attributes['label'] ?? '',
				'font_size'   => $attributes['font_size'] ?? 16,
				'classes'     => $this->getClasses( $attributes ),
				'description' => $attributes['description'] ?? '',
				'content'     => $content,
				'id'          => 'ce-checkout-' . $ce_form_id,
				'prices'      => $attributes['prices'] ?? [],
				'choice_type' => $attributes['choice_type'] ?? 'all',
				'success_url' => $attributes['redirect'] ?? \CheckoutEngine::pages()->url( 'order-confirmation' ),
				'i18n'        => $this->getTranslations(),
			]
		);
	}

	/**
	 * Get translations for payment gateways.
	 */
	public function getTranslations() {
		return [
			// Stripe.
			'account_already_exists'                     => __( 'The email address provided for the creation of a deferred account already has an account associated with it. Use the OAuth flow to connect the existing account to your platform.', 'checkout_engine' ),
			'account_country_invalid_address'            => __( 'The country of the business address provided does not match the country of the account. Businesses must be located in the same country as the account.', 'checkout_engine' ),
			'account_invalid'                            => __( 'The account ID provided as a value for the Stripe-Account header is invalid. Check that your requests are specifying a valid account ID.', 'checkout_engine' ),
			'account_number_invalid'                     => __( 'The bank account number provided is invalid (e.g., missing digits). Bank account information varies from country to country. We recommend creating validations in your entry forms based on the bank account formats we provide.', 'checkout_engine' ),
			'alipay_upgrade_required'                    => __( 'This method for creating Alipay payments is not supported anymore. Please upgrade your integration to use Sources instead.', 'checkout_engine' ),
			'amount_too_large'                           => __( 'The specified amount is greater than the maximum amount allowed. Use a lower amount and try again.', 'checkout_engine' ),
			'amount_too_small'                           => __( 'The specified amount is less than the minimum amount allowed. Use a higher amount and try again.', 'checkout_engine' ),
			'api_key_expired'                            => __( 'The API key provided has expired. Obtain your current API keys from the Dashboard and update your integration to use them.', 'checkout_engine' ),
			'balance_insufficient'                       => __( 'The transfer or payout could not be completed because the associated account does not have a sufficient balance available. Create a new transfer or payout using an amount less than or equal to the account’s available balance.', 'checkout_engine' ),
			'bank_account_exists'                        => __( 'The bank account provided already exists on the specified Customer object. If the bank account should also be attached to a different customer, include the correct customer ID when making the request again.', 'checkout_engine' ),
			'bank_account_unusable'                      => __( 'The bank account provided cannot be used for payouts. A different bank account must be used.', 'checkout_engine' ),
			'bank_account_unverified'                    => __( 'Your Connect platform is attempting to share an unverified bank account with a connected account.', 'checkout_engine' ),
			'bitcoin_upgrade_required'                   => __( 'This method for creating Bitcoin payments is not supported anymore. Please upgrade your integration to use Sources instead.', 'checkout_engine' ),
			'card_declined'                              => __( 'The card has been declined. When a card is declined, the error returned also includes the decline_code attribute with the reason why the card was declined. Refer to our decline codes documentation to learn more.', 'checkout_engine' ),
			'charge_already_captured'                    => __( 'The charge you’re attempting to capture has already been captured. Update the request with an uncaptured charge ID.', 'checkout_engine' ),
			'charge_already_refunded'                    => __( 'The charge you’re attempting to refund has already been refunded. Update the request to use the ID of a charge that has not been refunded.', 'checkout_engine' ),
			'charge_disputed'                            => __( 'The charge you’re attempting to refund has been charged back. Check the disputes documentation to learn how to respond to the dispute.', 'checkout_engine' ),
			'charge_exceeds_source_limit'                => __( 'This charge would cause you to exceed your rolling-window processing limit for this source type. Please retry the charge later, or contact us to request a higher processing limit.', 'checkout_engine' ),
			'charge_expired_for_capture'                 => __( 'The charge cannot be captured as the authorization has expired. Auth and capture charges must be captured within seven days.', 'checkout_engine' ),
			'country_unsupported'                        => __( 'Your platform attempted to create a custom account in a country that is not yet supported. Make sure that users can only sign up in countries supported by custom accounts.', 'checkout_engine' ),
			'coupon_expired'                             => __( 'The coupon provided for a subscription or order has expired. Either create a new coupon, or use an existing one that is valid.', 'checkout_engine' ),
			'customer_max_subscriptions'                 => __( 'The maximum number of subscriptions for a customer has been reached. Contact us if you are receiving this error.', 'checkout_engine' ),
			'email_invalid'                              => __( 'The email address is invalid (e.g., not properly formatted). Check that the email address is properly formatted and only includes allowed characters.', 'checkout_engine' ),
			'expired_card'                               => __( 'The card has expired. Check the expiration date or use a different card.', 'checkout_engine' ),
			'idempotency_key_in_use'                     => __( 'The idempotency key provided is currently being used in another request. This occurs if your integration is making duplicate requests simultaneously.', 'checkout_engine' ),
			'incorrect_address'                          => __( 'The card’s address is incorrect. Check the card’s address or use a different card.', 'checkout_engine' ),
			'incorrect_cvc'                              => __( 'The card’s security code is incorrect. Check the card’s security code or use a different card.', 'checkout_engine' ),
			'incorrect_number'                           => __( 'The card number is incorrect. Check the card’s number or use a different card.', 'checkout_engine' ),
			'incorrect_zip'                              => __( 'The card’s postal code is incorrect. Check the card’s postal code or use a different card.', 'checkout_engine' ),
			'instant_payouts_unsupported'                => __( 'The debit card provided as an external account does not support instant payouts. Provide another debit card or use a bank account instead.', 'checkout_engine' ),
			'invalid_card_type'                          => __( 'The card provided as an external account is not a debit card. Provide a debit card or use a bank account instead.', 'checkout_engine' ),
			'invalid_charge_amount'                      => __( 'The specified amount is invalid. The charge amount must be a positive integer in the smallest currency unit, and not exceed the minimum or maximum amount.', 'checkout_engine' ),
			'invalid_cvc'                                => __( 'The card’s security code is invalid. Check the card’s security code or use a different card.', 'checkout_engine' ),
			'invalid_expiry_month'                       => __( 'The card’s expiration month is incorrect. Check the expiration date or use a different card.', 'checkout_engine' ),
			'invalid_expiry_year'                        => __( 'The card’s expiration year is incorrect. Check the expiration date or use a different card.', 'checkout_engine' ),
			'invalid_number'                             => __( 'The card number is invalid. Check the card details or use a different card.', 'checkout_engine' ),
			'invalid_source_usage'                       => __( 'The source cannot be used because it is not in the correct state (e.g., a charge request is trying to use a source with a pending, failed, or consumed source). Check the status of the source you are attempting to use.', 'checkout_engine' ),
			'invoice_no_customer_line_items'             => __( 'An invoice cannot be generated for the specified customer as there are no pending invoice items. Check that the correct customer is being specified or create any necessary invoice items first.', 'checkout_engine' ),
			'invoice_no_subscription_line_items'         => __( 'An invoice cannot be generated for the specified subscription as there are no pending invoice items. Check that the correct subscription is being specified or create any necessary invoice items first.', 'checkout_engine' ),
			'invoice_not_editable'                       => __( 'The specified invoice can no longer be edited. Instead, consider creating additional invoice items that will be applied to the next invoice. You can either manually generate the next invoice or wait for it to be automatically generated at the end of the billing cycle.', 'checkout_engine' ),
			'invoice_upcoming_none'                      => __( 'There is no upcoming invoice on the specified customer to preview. Only customers with active subscriptions or pending invoice items have invoices that can be previewed.', 'checkout_engine' ),
			'livemode_mismatch'                          => __( 'Test and live mode API keys, requests, and objects are only available within the mode they are in.', 'checkout_engine' ),
			'missing'                                    => __( 'Both a customer and source ID have been provided, but the source has not been saved to the customer. To create a charge for a customer with a specified source, you must first save the card details.', 'checkout_engine' ),
			'not_allowed_on_standard_account'            => __( 'Transfers and payouts on behalf of a Standard connected account are not allowed.', 'checkout_engine' ),
			'order_creation_failed'                      => __( 'The order could not be created. Check the order details and then try again.', 'checkout_engine' ),
			'order_required_settings'                    => __( 'The order could not be processed as it is missing required information. Check the information provided and try again.', 'checkout_engine' ),
			'order_status_invalid'                       => __( 'The order cannot be updated because the status provided is either invalid or does not follow the order lifecycle (e.g., an order cannot transition from created to fulfilled without first transitioning to paid).', 'checkout_engine' ),
			'order_upstream_timeout'                     => __( 'The request timed out. Try again later.', 'checkout_engine' ),
			'out_of_inventory'                           => __( 'The SKU is out of stock. If more stock is available, update the SKU’s inventory quantity and try again.', 'checkout_engine' ),
			'parameter_invalid_empty'                    => __( 'One or more required values were not provided. Make sure requests include all required parameters.', 'checkout_engine' ),
			'parameter_invalid_integer'                  => __( 'One or more of the parameters requires an integer, but the values provided were a different type. Make sure that only supported values are provided for each attribute. Refer to our API documentation to look up the type of data each attribute supports.', 'checkout_engine' ),
			'parameter_invalid_string_blank'             => __( 'One or more values provided only included whitespace. Check the values in your request and update any that contain only whitespace.', 'checkout_engine' ),
			'parameter_invalid_string_empty'             => __( 'One or more required string values is empty. Make sure that string values contain at least one character.', 'checkout_engine' ),
			'parameter_missing'                          => __( 'One or more required values are missing. Check our API documentation to see which values are required to create or modify the specified resource.', 'checkout_engine' ),
			'parameter_unknown'                          => __( 'The request contains one or more unexpected parameters. Remove these and try again.', 'checkout_engine' ),
			'parameters_exclusive'                       => __( 'Two or more mutually exclusive parameters were provided. Check our API documentation or the returned error message to see which values are permitted when creating or modifying the specified resource.', 'checkout_engine' ),
			'payment_intent_authentication_failure'      => __( 'The provided source has failed authentication. Provide source_data or a new source to attempt to fulfill this PaymentIntent again.', 'checkout_engine' ),
			'payment_intent_incompatible_payment_method' => __( 'The PaymentIntent expected a payment method with different properties than what was provided.', 'checkout_engine' ),
			'payment_intent_invalid_parameter'           => __( 'One or more provided parameters was not allowed for the given operation on the PaymentIntent. Check our API reference or the returned error message to see which values were not correct for that PaymentIntent.', 'checkout_engine' ),
			'payment_intent_payment_attempt_failed'      => __( 'The latest payment attempt for the PaymentIntent has failed. Check the last_payment_error property on the PaymentIntent for more details, and provide source_data or a new source to attempt to fulfill this PaymentIntent again.', 'checkout_engine' ),
			'payment_intent_unexpected_state'            => __( 'The PaymentIntent’s state was incompatible with the operation you were trying to perform.', 'checkout_engine' ),
			'payment_method_unactivated'                 => __( 'The charge cannot be created as the payment method used has not been activated. Activate the payment method in the Dashboard, then try again.', 'checkout_engine' ),
			'payment_method_unexpected_state'            => __( 'The provided payment method’s state was incompatible with the operation you were trying to perform. Confirm that the payment method is in an allowed state for the given operation before attempting to perform it.', 'checkout_engine' ),
			'payouts_not_allowed'                        => __( 'Payouts have been disabled on the connected account. Check the connected account’s status to see if any additional information needs to be provided, or if payouts have been disabled for another reason.', 'checkout_engine' ),
			'platform_api_key_expired'                   => __( 'The API key provided by your Connect platform has expired. This occurs if your platform has either generated a new key or the connected account has been disconnected from the platform. Obtain your current API keys from the Dashboard and update your integration, or reach out to the user and reconnect the account.', 'checkout_engine' ),
			'postal_code_invalid'                        => __( 'The postal code provided was incorrect.', 'checkout_engine' ),
			'processing_error'                           => __( 'An error occurred while processing the card. Check the card details are correct or use a different card.', 'checkout_engine' ),
			'product_inactive'                           => __( 'The product this SKU belongs to is no longer available for purchase.', 'checkout_engine' ),
			'rate_limit'                                 => __( 'Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.', 'checkout_engine' ),
			'resource_already_exists'                    => __( 'A resource with a user-specified ID (e.g., plan or coupon) already exists. Use a different, unique value for id and try again.', 'checkout_engine' ),
			'resource_missing'                           => __( 'The ID provided is not valid. Either the resource does not exist, or an ID for a different resource has been provided.', 'checkout_engine' ),
			'routing_number_invalid'                     => __( 'The bank routing number provided is invalid.', 'checkout_engine' ),
			'secret_key_required'                        => __( 'The API key provided is a publishable key, but a secret key is required. Obtain your current API keys from the Dashboard and update your integration to use them.', 'checkout_engine' ),
			'sepa_unsupported_account'                   => __( 'Your account does not support SEPA payments.', 'checkout_engine' ),
			'shipping_calculation_failed'                => __( 'Shipping calculation failed as the information provided was either incorrect or could not be verified.', 'checkout_engine' ),
			'sku_inactive'                               => __( 'The SKU is inactive and no longer available for purchase. Use a different SKU, or make the current SKU active again.', 'checkout_engine' ),
			'state_unsupported'                          => __( 'Occurs when providing the legal_entity information for a U.S. custom account, if the provided state is not supported. (This is mostly associated states and territories.)', 'checkout_engine' ),
			'tax_id_invalid'                             => __( 'The tax ID number provided is invalid (e.g., missing digits). Tax ID information varies from country to country, but must be at least nine digits.', 'checkout_engine' ),
			'taxes_calculation_failed'                   => __( 'Tax calculation for the order failed.', 'checkout_engine' ),
			'testmode_charges_only'                      => __( 'Your account has not been activated and can only make test charges. Activate your account in the Dashboard to begin processing live charges.', 'checkout_engine' ),
			'tls_version_unsupported'                    => __( 'Your integration is using an older version of TLS that is unsupported. You must be using TLS 1.2 or above.', 'checkout_engine' ),
			'token_already_used'                         => __( 'The token provided has already been used. You must create a new token before you can retry this request.', 'checkout_engine' ),
			'token_in_use'                               => __( 'The token provided is currently being used in another request. This occurs if your integration is making duplicate requests simultaneously.', 'checkout_engine' ),
			'transfers_not_allowed'                      => __( 'The requested transfer cannot be created. Contact us if you are receiving this error.', 'checkout_engine' ),
			'upstream_order_creation_failed'             => __( 'The order could not be created. Check the order details and then try again.', 'checkout_engine' ),
			'url_invalid'                                => __( 'The URL provided is invalid.', 'checkout_engine' ),
		];
	}
}
