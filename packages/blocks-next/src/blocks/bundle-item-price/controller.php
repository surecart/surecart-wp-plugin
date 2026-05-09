<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
if ( empty( $bundle_item ) ) {
	return '';
}

return 'file:./view.php';
