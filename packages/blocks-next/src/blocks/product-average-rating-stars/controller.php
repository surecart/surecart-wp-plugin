<?php

use SureCartBlocks\Util\BlockStyleAttributes;

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

$average_rating   = $product->average_stars;
$fill_color_attr  = $attributes['fill_color'] ?? '';
$empty_color_attr = $attributes['empty_color'] ?? '';
$size             = $attributes['size'] ?? 25;

$fill_color = BlockStyleAttributes::getColorValue( $fill_color_attr );
if ( empty( $fill_color ) ) {
	$fill_color = 'var(--sc-color-primary-500)';
}

$empty_color = BlockStyleAttributes::getColorValue( $empty_color_attr );
if ( empty( $empty_color ) ) {
	$empty_color = 'var(--sc-color-gray-300)';
}

return 'file:./view.php';
