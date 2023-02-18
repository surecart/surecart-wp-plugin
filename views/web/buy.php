<?php
/*
Template Name: SureCart
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php do_action( 'surecart_buy_page_body_open' ); ?>

	<sc-checkout id="checkout-buy-form" style="text-align: left;--sc-form-row-spacing: 25px;">
		<sc-form>
			<sc-columns is-stacked-on-mobile="1" is-full-height="1" is-reversed-on-mobile="1" class="wp-block-surecart-columns has-background" style="background-color:#f3f4f6;gap:0px 0px">
				<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right has-white-background-color has-background" style="padding-top:60px;padding-right:60px;padding-bottom:60px;padding-left:60px;--sc-column-content-width:450px;--sc-form-row-spacing:30px">
					<sc-customer-email label="Email" placeholder="your@email.com" required></sc-customer-email>

					<sc-customer-name label="Name" placeholder="Your Full Name" required></sc-customer-name>

					<sc-payment id="checkout-buy-payment">
						<sc-stripe-payment-element slot="stripe"></sc-stripe-payment-element>
					</sc-payment>

					<sc-order-submit type="primary" full="true" size="large" icon="lock" show-total="true">Purchase</sc-order-submit>
				</sc-column>

				<sc-column class="wp-block-surecart-column is-sticky is-layout-constrained is-horizontally-aligned-left" style="padding-top:60px;padding-right:60px;padding-bottom:60px;padding-left:60px;--sc-column-content-width:450px;--sc-form-row-spacing:30px">
					<sc-order-summary collapsible="1" closed-text="" open-text="" collapsed-on-mobile="1" class="wp-block-surecart-totals">
						<sc-divider></sc-divider>

						<sc-line-items removable="1" editable="1" class="wp-block-surecart-line-items"></sc-line-items>

						<sc-divider></sc-divider>

						<sc-line-item-total total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span></sc-line-item-total>

						<sc-order-coupon-form></sc-order-coupon-form>

						<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>

						<sc-divider></sc-divider>

						<sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="title">Total</span><span slot="subscription-title">Total Due Today</span></sc-line-item-total>
					</sc-order-summary>
				</sc-column>
			</sc-columns>
		</sc-form>
	</sc-checkout>

	<?php
	\SureCart::assets()->addComponentData(
		'sc-checkout',
		'#checkout-buy-form',
		[
			'product'                    => $product,
			'prices'                     => $prices,
			'customer'                   => $customer ?? '',
			'formId'                     => $form_id ?? '',
			'currencyCode'               => $currency_code ?? null,
			'modified'                   => $modified ?? null,
			'loggedIn'                   => is_user_logged_in(),
			'mode'                       => $mode ?? 'live',
			'alignment'                  => $align ?? '',
			'taxProtocol'                => $tax_protocol ?? [],
			'loadingText'                => $loading_text ?? [],
			'stripePaymentElement'       => $stripe_payment_element ?? false,
			'successUrl'                 => esc_url_raw( $success_url ?? \SureCart::pages()->url( 'order-confirmation' ) ),
			'processors'                 => $processors,
			'manualPaymentMethods'       => $manual_payment_methods,
			'abandonedCheckoutReturnUrl' => $abandoned_checkout_return_url,
		]
	);
	?>

	<?php
	wp_footer();
	?>
</body>

</html>
