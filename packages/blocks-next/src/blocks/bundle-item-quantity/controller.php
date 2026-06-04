<?php
$bundle_item          = $block->context['surecart/bundleItem'] ?? null;
$show_single_quantity = $attributes['showSingleQuantity'] ?? false;
$quantity             = max( 1, (int) ( $bundle_item->quantity ?? 1 ) );

// Hide single-quantity rows unless the block setting opts in to showing `× 1`.
if ( ! $show_single_quantity && $quantity <= 1 ) {
	return '';
}

return 'file:./view.php';
