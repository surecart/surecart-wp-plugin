<?php

$product = sc_get_product();

$gallery = $product->gallery ?? [];
$media   = $gallery[0] ?? null;

// get the width.
$width = false;
if ( ! empty( $attributes['width'] ) ) {
	$width = is_numeric( $attributes['width'] ) ? $attributes['width'] . 'px' : $attributes['width'];
}

// handle empty.
if ( empty( $gallery ) ) {
	return ! empty( $attributes['hide_empty'] ) ? '' : 'file:./empty.php';
}

if ( ! empty( $attributes['lightbox'] ) ) {
	wp_enqueue_style( 'surecart-lightbox' );
	wp_enqueue_script_module( 'surecart/lightbox' );
}

// Don't enqueue video script if there is no video in the gallery.
if ( $product->has_videos ) {
	wp_enqueue_script_module( '@surecart/video' );
	wp_enqueue_style( 'surecart-video' );
}

$auto_height = ! empty( $attributes['desktop_gallery'] ) ? true : ! empty( $attributes['auto_height'] ) && $attributes['auto_height'];

// handle image.
if ( count( $gallery ) === 1 ) {
	$style = ! empty( $width ) ? 'max-width: min(' . esc_attr( $width ) . ', 100%);' : '';
	return $media->isVideo() ? 'file:./video.php' : 'file:./image.php';
}

// only enqueue if we are needing a slideshow.
wp_enqueue_style( 'surecart-image-slider' );
wp_enqueue_script_module( '@surecart/image-slider' );

// handle slideshow.
$slider_options = array(
	'activeBreakpoint'   => apply_filters( 'surecart/image-slider/active-breakpoint', $attributes['desktop_gallery'] ? 782 : false ),
	'sliderOptions'      => array(
		'autoHeight'   => $auto_height,
		'spaceBetween' => 40,
	),
	'thumbSliderOptions' => array(
		'slidesPerView'  => $attributes['thumbnails_per_page'] ?? 5,
		'slidesPerGroup' => $attributes['thumbnails_per_page'] ?? 5,
		'breakpoints'    => array(
			320 => array(
				'slidesPerView'  => $attributes['thumbnails_per_page'] ?? 5,
				'slidesPerGroup' => $attributes['thumbnails_per_page'] ?? 5,
			),
		),
	),
);

$height = 'auto';
if ( ! $auto_height && ! empty( $attributes['height'] ) ) {
	$height = $attributes['height'];
}

wp_interactivity_state(
	'surecart/image-slider',
	array(
		'active' => true, // to prevent flash of unstyled content.
	)
);

return 'file:./slideshow.php';
