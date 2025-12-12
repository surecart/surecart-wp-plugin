<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'style' => $style ] ) ); ?>>
	<?php
	ob_start();
	for ( $i = 1; $i <= 5; $i++ ) {
		$is_full_star = $i <= $whole_stars;
		$is_half_star = $has_half && $i === $whole_stars + 1;

		echo wp_kses(
			SureCart::svg()->get(
				$is_half_star ? 'half-star' : 'star',
				[
					'class'  => 'sc-star-row__label__svg',
					'height' => esc_attr( $size ),
					'width'  => esc_attr( $size ),
					'fill'   => $is_full_star || $is_half_star ? esc_attr( $fill_color ) : 'none',
					'color'  => $is_half_star ? esc_attr( $fill_color ) : 'none',
					'stroke' => esc_attr( $fill_color ) ?? 'none',
				]
			),
			sc_allowed_svg_html()
		);
	}
	$stars_output = ob_get_clean();

	if ( $link_to_reviews ) {
		$reviews_url = esc_url( $product->permalink . '#surecart-reviews' );
		// translators: %1$s: reviews URL, %2$s: stars output.
		printf( '<a href="%1$s" class="sc-review-link">%2$s</a>', $reviews_url, $stars_output ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	} else {
		echo $stars_output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	?>
</div>