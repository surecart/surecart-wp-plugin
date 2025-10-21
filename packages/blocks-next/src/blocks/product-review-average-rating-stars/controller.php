<?php

use SureCartBlocks\Util\BlockStyleAttributes;

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

$average_rating = (float) ( $product->average_stars ?? 0 );
$size           = $attributes['size'] ?? 25;

/*
 * Calculate whole and half stars based on average rating.
 *
 * Example: 4.3 average rating = 4 whole stars and 1 half star.
 */
$whole_stars = (int) floor( $average_rating );
$has_half    = $whole_stars < $average_rating;

$fill_color = BlockStyleAttributes::getColorValue( $attributes['fill_color'] ?? '' );
if ( empty( $fill_color ) ) {
	$fill_color = 'var(--sc-color-primary-500)';
}

return 'file:./view.php';
