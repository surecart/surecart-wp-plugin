<?php

use SureCartBlocks\Util\BlockStyleAttributes;

if ( empty( $block->context['review'] ) ) {
	return;
}

$rating     = (float) ( $block->context['review']->stars ?? 0 );
$size       = $attributes['size'] ?? 20;
$fill_color = BlockStyleAttributes::getColorValue( $attributes['fill_color'] ?? '' );
$gap        = ! empty( $attributes['style']['spacing']['blockGap'] ) ? \SureCart::block()->styles()->getBlockGapPresetCssVar( $attributes['style']['spacing']['blockGap'] ) : '';
$style      = ! empty( $gap ) ? 'gap:' . esc_attr( $gap ) . ';' : '';
$stars      = (int) $block->context['review']->stars;

/* translators: %d: number of stars out of 5 */
$aria_label = sprintf( _n( '%d star out of 5', '%d stars out of 5', $stars, 'surecart' ), $stars );

if ( empty( $fill_color ) ) {
	$fill_color = 'var(--sc-color-primary-500)';
}

return 'file:./view.php';
