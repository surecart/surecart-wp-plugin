<div
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
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
