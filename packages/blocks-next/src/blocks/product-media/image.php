<figure
	data-wp-interactive='{ "namespace": "surecart/lightbox" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => $is_video_featured ? 'sc-video-container' : 'sc-lightbox-container' ] ) ); ?>
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
	$style        = ! empty( $width ) ? 'max-width: min(' . esc_attr( $width ) . ', 100%);' : '';
	$aspect_ratio = $featured_image->getMetadata( 'aspect_ratio' );
	$style       .= ! empty( $aspect_ratio ) ? 'aspect-ratio: ' . esc_attr( $aspect_ratio ) . ';' : '';

	echo wp_kses(
		$featured_image->withLightbox( $is_video_featured ? false : $attributes['lightbox'] )->html(
			'large',
			array(
				'loading' => 'eager',
				'style'   => $style,
			)
		),
		sc_allowed_svg_html()
	);
	?>
</figure>
