<?php
$bundle_item          = $block->context['surecart/bundleItem'] ?? null;
$show_single_quantity = $attributes['showSingleQuantity'] ?? true;
$quantity             = max( 1, (int) ( $bundle_item->quantity ?? 1 ) );

// When the merchant opts out of showing single-quantity components, hide
// the row entirely for qty 1. Default behavior keeps `× 1` visible so all
// component rows in a bundle line up the same way.
if ( ! $show_single_quantity && $quantity <= 1 ) {
	return '';
}

return 'file:./view.php';
