<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	for ( $i = 1; $i <= 5; $i++ ) {
		$is_full = $i <= (int) $block->context['review']->stars;

		echo wp_kses(
			SureCart::svg()->get(
				'star',
				[
					'height'       => esc_attr( $size ),
					'width'        => esc_attr( $size ),
					'fill'         => $is_full ? $fill_color : 'none',
					'stroke'       => $fill_color ?? 'none',
					'stroke-width' => 2,
				]
			),
			sc_allowed_svg_html()
		);
	}
	?>
</div>