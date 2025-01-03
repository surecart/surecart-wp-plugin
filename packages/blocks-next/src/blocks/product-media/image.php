<figure
	data-wp-interactive='{ "namespace": "@surecart/lightbox" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'wp-lightbox-container' ] ) ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'imageId' => $featured_image->id ] ) ); ?>
>
	<?php
	echo wp_kses(
		$featured_image->withLightbox()->html(
			'large',
			array(
				'loading' => 'eager',
				'style'   => ! empty( $width ) ? 'max-width:' . esc_attr( $width ) : '',
			)
		),
		sc_allowed_svg_html()
	);
	?>
</figure>
