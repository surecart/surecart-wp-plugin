<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'style' => $style ] ) ); ?> role="img" aria-label="<?php echo esc_attr( $aria_label ); ?>">
	<?php
	for ( $i = 1; $i <= 5; $i++ ) {
		$should_fill = $i <= $stars;

		echo wp_kses(
			SureCart::svg()->get(
				'star',
				[
					'class'        => 'sc-star-row__label__svg',
					'height'       => esc_attr( $size ),
					'width'        => esc_attr( $size ),
					'fill'         => $fill_color,
					'fill-opacity' => $should_fill ? 1 : 0,
					'stroke'       => $fill_color,
					'stroke-width' => 2,
					'aria-hidden'  => 'true',
				]
			),
			sc_allowed_svg_html()
		);
	}
	?>
</div>
