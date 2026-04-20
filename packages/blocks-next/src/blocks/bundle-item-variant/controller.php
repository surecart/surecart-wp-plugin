<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
if ( empty( $bundle_item ) || empty( $bundle_item->variant ) || empty( $bundle_item->variant->name ) ) {
	return '';
}

$variant_name = $bundle_item->variant->name;

return 'file:./view.php';
