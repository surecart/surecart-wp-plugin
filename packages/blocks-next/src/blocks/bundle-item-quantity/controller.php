<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
$quantity    = max( 1, (int) ( $bundle_item->quantity ?? 1 ) );

// Hide the `× 1` multiplier for single-quantity rows.
if ( $quantity <= 1 ) {
	return '';
}

return 'file:./view.php';
