<div
	id="reviews"
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'reviews' => $reviews,
			)
		)
	);
	?>
	data-wp-interactive='{ "namespace": "surecart/product-review" }'
	data-wp-router-region="<?php echo esc_attr( 'product-reviews-' . $product->id ); ?>"
	role="region"
	aria-label="<?php esc_attr_e( 'Customer Reviews', 'surecart' ); ?>"
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<div class="sc-block-ui" data-wp-bind--hidden="!state.loading" hidden aria-live="polite" aria-busy="true"></div>
</div>
