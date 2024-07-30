<?php

use SureCart\Models\Blocks\ProductPageBlock;

if ( ! isset( $block->context['value'] ) ) {
	return;
}

$product_page = new ProductPageBlock( $block );
$product_page->urlParams()->addArg( $block->context['name'], $block->context['value'] );
$url = $product_page->urlParams()->url();

return 'file:./view.php';
