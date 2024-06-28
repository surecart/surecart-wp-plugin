<?php
use SureCart\Models\Blocks\ProductListBlock;

$block_id   = (int) $block->context['surecart/product-list/block_id'] ?? '';
$controller = new ProductListBlock( $block );
$list_query = $controller->query();
$value      = $list_query->s;

// return the view.
return 'file:./view.php';
