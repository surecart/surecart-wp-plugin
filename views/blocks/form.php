<sc-checkout
	class="checkout"
	id="<?php echo esc_attr( $id ); ?>"
	class="<?php echo esc_attr( $classes ); ?>"
	style="<?php echo esc_attr( $style ); ?>"
>
	<sc-form>
		<?php if ( (bool) $honeypot_enabled ?? false ) : ?>
			<sc-checkbox name="get_feedback" value="Feedback" style="display: none !important;"></sc-checkbox>
		<?php endif; ?>
		<?php echo filter_block_content( $content, 'post' ); ?>
	</sc-form>
</sc-checkout>
<sc-register-icon-library></sc-register-icon-library>


<?php
// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
\SureCart::assets()->addComponentData(
	'sc-checkout',
	'#' . $id,
	[
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
		'successText'                => $success_text ?? [],
		'stripePaymentElement'       => $stripe_payment_element ?? false,
		'successUrl'                 => esc_url_raw( $success_url ?? \SureCart::pages()->url( 'order-confirmation' ) ),
		'processors'                 => $processors,
		'manualPaymentMethods'       => $manual_payment_methods,
		'abandonedCheckoutReturnUrl' => $abandoned_checkout_return_url,
	]
);
?>
