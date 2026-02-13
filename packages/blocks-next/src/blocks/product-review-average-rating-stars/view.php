<<?php echo esc_html( $html_tag ); ?> <?php
echo wp_kses_data(
	get_block_wrapper_attributes(
		array_filter(
			[
				'style'      => $style,
				'class'      => $link_to_reviews ? 'sc-review-link' : null,
				'href'       => $link_to_reviews ? sc_get_product_review_link() : null,
				'nofollow'   => $link_to_reviews ? true : false,
				// translators: %s: average star rating (e.g. 4.5).
				'aria-label' => sprintf( __( '%s out of 5 stars', 'surecart' ), number_format( $average_rating, 1 ) ),
			]
		)
	)
);
?>
>
	<?php
	for ( $i = 1; $i <= 5; $i++ ) {
		$is_full_star = $i <= $whole_stars;
		$is_half_star = $has_half && $i === $whole_stars + 1;

		// Determine if the star needs to be filled based on the average rating and the current star index.
		$needs_fill = $average_rating > $i - 1 ? min( 1, $average_rating - ( $i - 1 ) ) : 0;

		echo wp_kses(
			SureCart::svg()->get(
				$is_half_star ? 'half-star' : 'star',
				[
					'class'        => 'sc-star-row__label__svg',
					'height'       => esc_attr( $size ),
					'width'        => esc_attr( $size ),
					'fill'         => $needs_fill ? esc_attr( $fill_color ) : 'none',
					'fill-opacity' => ! $needs_fill ? 0 : 1,
					'stroke'       => esc_attr( $fill_color ),
					'stroke-width' => 2,
					'aria-hidden'  => 'true',
				]
			),
			sc_allowed_svg_html()
		);
	}
	?>
</<?php echo esc_html( $html_tag ); ?>>
