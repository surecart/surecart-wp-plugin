<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( ! empty( $show_label ) ) : ?>
		<?php echo ( ! empty( $label ) ? esc_html( $label ) : esc_html__( 'Verified Buyer', 'surecart' ) ); ?>
	<?php endif; ?>

	<?php
	echo wp_kses(
		SureCart::svg()->get(
			'verified',
			[
				'width'  => esc_attr( $icon_size ),
				'height' => esc_attr( $icon_size ),
			]
		),
		sc_allowed_svg_html()
	);
	?>
</div>
