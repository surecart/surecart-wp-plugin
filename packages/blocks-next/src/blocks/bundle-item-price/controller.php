<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
if ( empty( $bundle_item ) ) {
	return '';
}

$price          = $bundle_item->price ?? null;
$display_amount = $price->display_amount ?? '';

if ( empty( $display_amount ) ) {
	return '';
}

return 'file:./view.php';
