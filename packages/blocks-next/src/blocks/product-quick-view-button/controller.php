<?php
$icon            = $attributes['icon'] ?? 'eye';
$product_id      = $block->context['postId'] ?? null;
$url             = \SureCart::block()->urlParams( 'product-quick-view' );
$quick_view_link = $url->addArg( 'id', $product_id )->url();

return 'file:./view.php';
