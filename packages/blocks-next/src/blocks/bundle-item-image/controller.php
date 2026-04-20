<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
if ( empty( $bundle_item ) ) {
	return '';
}

$component_product = $bundle_item->product ?? null;
$component_image   = $component_product->line_item_image ?? null;
$component_name    = $component_product->name ?? '';

return 'file:./view.php';
