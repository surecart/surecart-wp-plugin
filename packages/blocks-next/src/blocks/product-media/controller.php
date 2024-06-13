<?php

$product        = sc_get_product();
$gallery        = $product->gallery;
$featured_image = $gallery[0] ?? null;

if ( empty( $gallery ) ) {
	return 'file:./empty.php';
}

if ( count( $gallery ) === 1 ) {
	return 'file:./image.php';
}

$slider_options = array(
	'sliderOptions'      => array(
		'autoHeight'   => ! empty( $attributes['auto_height'] ),
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
if ( empty( $attributes['auto_height'] ) && ! empty( $attributes['height'] ) ) {
	$height = $attributes['height'];
}

return 'file:./slideshow.php';
