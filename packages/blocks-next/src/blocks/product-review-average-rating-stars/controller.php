<?php

use SureCartBlocks\Util\BlockStyleAttributes;

$product = sc_get_product();

// no product.
if ( empty( $product ) ) {
	return;
}

// reviews are not enabled.
if ( ! apply_filters( 'surecart/review_stars/enabled', $product->reviews_enabled ) ) {
	return;
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

// Get link_to_reviews from context (parent block) or fallback to attribute (for standalone usage like Elementor/Bricks).
$link_to_reviews = $block->context['link_to_reviews'] ?? $attributes['link_to_reviews'] ?? false;
$html_tag        = $link_to_reviews ? 'a' : 'div';

return 'file:./view.php';
