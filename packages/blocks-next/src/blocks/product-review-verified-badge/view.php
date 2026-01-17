<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> aria-label="<?php echo esc_attr( $badge_label ); ?>">
	<?php if ( ! empty( $show_label ) ) : ?>
		<span aria-hidden="true"><?php echo esc_html( $badge_label ); ?></span>
	<?php endif; ?>

	<?php
	echo wp_kses(
		SureCart::svg()->get(
			'verified',
			[
				'width'       => esc_attr( $icon_size ),
				'height'      => esc_attr( $icon_size ),
				'aria-hidden' => 'true',
			]
		),
		sc_allowed_svg_html()
	);
	?>
</div>
