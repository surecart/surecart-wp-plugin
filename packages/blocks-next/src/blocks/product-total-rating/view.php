<?php
$product = sc_get_product();
if ( ! $product ) {
	return;
}
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<span class="sc-total-reviews-count"><?php echo esc_html( $product->total_reviews ); ?></span>

	<?php if ( ! empty( $attributes['show_label'] ) ) : ?>
		<?php echo $product->total_reviews <= 1 ? esc_html__( 'review', 'surecart' ) : esc_html__( 'reviews', 'surecart' ); ?>
	<?php endif; ?>
</div>