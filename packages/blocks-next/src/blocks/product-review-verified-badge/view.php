<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> aria-label="<?php echo esc_attr( $badge_label ); ?>">
	<?php if ( ! empty( $show_label ) ) : ?>
		<span aria-hidden="true"><?php echo esc_html( $badge_label ); ?></span>
	<?php endif; ?>

	<?php
	$icon_attributes = [
		'width'       => esc_attr( $icon_size ),
		'height'      => esc_attr( $icon_size ),
		'aria-hidden' => 'true',
	];

	// Add icon color style if set.
	if ( ! empty( $icon_color ) ) {
		$icon_attributes['style'] = 'color: ' . esc_attr( $icon_color ) . ';';
	}

	echo wp_kses(
		SureCart::svg()->get( 'verified', $icon_attributes ),
		sc_allowed_svg_html()
	);
	?>
</div>
