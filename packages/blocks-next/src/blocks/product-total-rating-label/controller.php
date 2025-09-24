<?php

if ( ! ( $block->context['show_label'] ?? true ) ) {
	return '';
}

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

$label         = $attributes['label'] ?? '';
$total_reviews = (int) ( $product->total_reviews ?? 0 );
if ( empty( $label ) ) {
	$label = $total_reviews <= 1 ? __( 'review', 'surecart' ) : __( 'reviews', 'surecart' );
}

return 'file:./view.php';
