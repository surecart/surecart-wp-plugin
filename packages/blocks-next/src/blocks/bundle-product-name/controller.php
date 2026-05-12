<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
if ( empty( $bundle_item ) ) {
	return '';
}

$product_name = $bundle_item->component_product->name ?? '';
if ( empty( $product_name ) ) {
	return '';
}

return 'file:./view.php';
