<sc-checkout
	class="checkout"
	id="<?php echo esc_attr( $id ); ?>"
	form-id="<?php echo esc_attr( $form_id ); ?>"
	class="<?php echo esc_attr( $classes ); ?>"
	modified="<?php echo esc_attr( $modified ); ?>"
	currency-code="<?php echo esc_attr( $currency_code ?? 'usd' ); ?>"
	logged-in="<?php echo is_user_logged_in() ? 'true' : 'false'; ?>"
	style="<?php echo esc_attr( $style ); ?>"
	mode="<?php echo esc_attr( $mode ); ?>"
	alignment="<?php echo esc_attr( $align ); ?>"
	success-url="<?php echo esc_url( $success_url ); ?>"
>
	<sc-form>
		<?php echo filter_block_content( $content, 'post' ); ?>
	</sc-form>
</sc-checkout>


<?php
// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
\SureCart::assets()->addComponentData(
	'sc-checkout',
	'#' . $id,
	[
		'prices'     => $prices,
		'customer'   => $customer,
		'processors' => $processors,
	]
);
?>
