<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	$output = '';
	if ( ! empty( $attributes['show_label'] ) ) {
		$label  = _n( 'review', 'reviews', $count, 'surecart' );
		$output = esc_html(
			// translators: 1: number of reviews, 2: label "review" or "reviews".
			sprintf( '%1$s %2$s', $display_number, $label )
		);
	} else {
		$output = esc_html( $display_number );
	}

	if ( $link_to_reviews ) {
		// translators: 1: reviews URL, 2: review output.
		printf( '<a href="%1$s" class="sc-review-link">%2$s</a>', esc_url( sc_get_product_review_link( $product ) ), $output ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	} else {
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	?>
</div>