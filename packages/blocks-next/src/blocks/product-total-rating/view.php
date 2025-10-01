<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<span class="sc-total-reviews-count"><?php echo esc_html( $product->total_reviews ); ?></span>

	<?php if ( ! empty( $attributes['show_label'] ) ) : ?>
		<?php echo esc_html( _n( 'review', 'reviews', (int) $product->total_reviews, 'surecart' ) ); ?>
	<?php endif; ?>
</div>