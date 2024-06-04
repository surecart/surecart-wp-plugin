<?php
$product = sc_get_product();

// If the scratch display amount is empty, return early.
if ( empty( $product->scratch_display_amount ) ) {
	return;
}
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<span class="sc-screen-reader-text"><?php esc_html_e( 'Compare to', 'surecart' ); ?></span>
	<?php echo wp_kses_post( $product->scratch_display_amount ); ?>
</div>
