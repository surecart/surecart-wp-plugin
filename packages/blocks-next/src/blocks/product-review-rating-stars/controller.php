<?php

use SureCartBlocks\Util\BlockStyleAttributes;

if ( empty( $block->context['review'] ) ) {
	return;
}

$rating     = (float) ( $block->context['review']->stars ?? 0 );
$size       = $attributes['size'] ?? 25;
$fill_color = BlockStyleAttributes::getColorValue( $attributes['fill_color'] ?? '' );
if ( empty( $fill_color ) ) {
	$fill_color = 'var(--sc-color-primary-500)';
}

return 'file:./view.php';
