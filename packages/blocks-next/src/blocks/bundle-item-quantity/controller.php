<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
$quantity    = (int) ( $bundle_item->quantity ?? 1 );

if ( $quantity <= 1 ) {
	return '';
}

return 'file:./view.php';
