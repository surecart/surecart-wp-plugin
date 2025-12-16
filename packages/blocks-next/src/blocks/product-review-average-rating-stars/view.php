<<?php echo esc_html( $html_tag ); ?> <?php
echo wp_kses_data(
	get_block_wrapper_attributes(
		array_filter(
			[
				'style'      => $style,
				'class'      => $link_to_reviews ? 'sc-review-link' : null,
				'href'       => $link_to_reviews ? sc_get_product_review_link() : null,
				// translators: %s: whole stars.
				'aria-label' => sprintf( __( '%d out of 5 stars', 'surecart' ), $average_rating ),
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
	?>
</<?php echo esc_html( $html_tag ); ?>>
