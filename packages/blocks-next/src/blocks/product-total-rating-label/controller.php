<?php

$product = sc_get_product();
if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

$show_label = $block->context['show_label'] ?? true;

return 'file:./view.php';
