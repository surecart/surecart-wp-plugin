<?php
$bundle_item          = $block->context['surecart/bundleItem'] ?? null;
$show_single_quantity = $attributes['showSingleQuantity'] ?? false;
$quantity             = max( 1, (int) ( $bundle_item->quantity ?? 1 ) );

// Single-quantity rows are hidden by default so only components with a
// higher quantity show the multiplier. Merchants can opt in to always
// showing `× 1` via the block setting.
if ( ! $show_single_quantity && $quantity <= 1 ) {
	return '';
}

return 'file:./view.php';
