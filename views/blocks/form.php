<ce-checkout
	class="checkout"
	id="<?php echo esc_attr( $id ); ?>"
	form-id="<?php echo esc_attr( $form_id ); ?>"
	class="<?php echo esc_attr( $classes ); ?>"
	style="<?php echo esc_attr( $style ); ?>"
	mode="<?php echo esc_attr( $mode ); ?>"
	alignment="<?php echo esc_attr( $align ); ?>"
	success-url="<?php echo esc_url( $success_url ); ?>"
>
	<ce-form>
		<?php echo filter_block_content( $content, 'post' ); ?>
	</ce-form>
</ce-checkout>


<?php
// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
\CheckoutEngine::assets()->addComponentData(
	'ce-checkout',
	'#' . $id,
	[
		'prices'   => $prices,
		'i18n'     => $i18n,
		'customer' => $customer,
	]
);
?>
