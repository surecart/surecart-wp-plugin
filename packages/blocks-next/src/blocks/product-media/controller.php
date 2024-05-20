<?php
global $content_width;

$product    = $block->context['surecart/product'];
$images     = $product->getDisplayImages( $attributes['width'] ?? $content_width, array( 600, 800, 1200 ) ) ?? [];
$thumbnails = $product->getDisplayImages( 240, array( 90, 120, 240 ) );
$featured_image = !empty($images) ? $images[0] : null;

if ( empty( $images )) {
	return 'file:./empty.php';
}

if ( count( $images ) === 1 ) {
	return 'file:./image.php';
}

return 'file:./slideshow.php';
