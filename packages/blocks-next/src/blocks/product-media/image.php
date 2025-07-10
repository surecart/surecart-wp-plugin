<?php
// Check if this is a video.
$is_video = false;
if ( isset( $featured_image->item->media ) && isset( $featured_image->item->media->mime_type ) && strpos( $featured_image->item->media->mime_type, 'video' ) !== false ) {
	$is_video = true;
} elseif ( isset( $featured_image->item->url ) ) {
	$file_extension = pathinfo( $featured_image->item->url, PATHINFO_EXTENSION );
	if ( in_array( strtolower( $file_extension ), [ 'mp4', 'webm', 'ogg' ], true ) ) {
		$is_video = true;
	}
}
?>

<figure
	data-wp-interactive='{ "namespace": "surecart/lightbox" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => $is_video ? 'sc-video-container' : 'sc-lightbox-container' ] ) ); ?>
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
		$featured_image->withLightbox( $is_video ? false : $attributes['lightbox'] )->html(
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
