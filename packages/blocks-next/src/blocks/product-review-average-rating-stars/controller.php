<?php

use SureCartBlocks\Util\BlockStyleAttributes;

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

$show_for_zero_reviews = $attributes['show_for_zero_reviews'] ?? true;

// If show_for_zero_reviews is false and there are no reviews, return early.
if ( ! $show_for_zero_reviews && 0 === (int) $product->total_reviews ) {
	return '';
}

$average_rating = (float) ( $product->average_stars ?? 0 );
$size           = $attributes['size'] ?? 20;

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

$gap   = ! empty( $attributes['style']['spacing']['blockGap'] ) ? \SureCart::block()->styles()->getBlockGapPresetCssVar( $attributes['style']['spacing']['blockGap'] ) : '';
$style = ! empty( $gap ) ? 'gap:' . esc_attr( $gap ) . ';' : '';

// Get link_to_reviews from attribute.
$link_to_reviews = $attributes['link_to_reviews'] ?? false;
$html_tag        = $link_to_reviews ? 'a' : 'div';

return 'file:./view.php';
