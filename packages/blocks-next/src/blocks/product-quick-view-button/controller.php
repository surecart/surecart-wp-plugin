<?php
$icon            = $attributes['icon'] ?? 'eye';
$product_id      = $block->context['postId'] ?? null;
$url             = \SureCart::block()->urlParams( 'product-quick-view' );
$quick_view_link = $url->addArg( 'id', $product_id )->url();
$show_icon       = 'icon' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$show_text       = 'text' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$label           = $attributes['label'] ?? __( 'Quick View', 'surecart' );

return 'file:./view.php';
