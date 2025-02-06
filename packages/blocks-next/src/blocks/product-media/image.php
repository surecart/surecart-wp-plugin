<figure
	data-wp-interactive='{ "namespace": "surecart/lightbox" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'sc-lightbox-container' ] ) ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'imageId' => $featured_image->id, // this is needed for the lightbox to work.
			]
		)
	);
	?>
>
	<?php
	echo wp_kses(
		$featured_image->withLightbox( $attributes['lightbox'] )->html(
			'large',
			array(
				'loading' => 'eager',
				'style'   => ! empty( $width ) ? 'max-width: min(' . esc_attr( $width ) . ', 100%)' : '',
			)
		),
		sc_allowed_svg_html()
	);
	?>
</figure>
