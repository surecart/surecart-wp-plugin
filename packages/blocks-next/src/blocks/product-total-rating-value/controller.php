<?php

$product = sc_get_product();
if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

$total_reviews_html = $product->total_reviews;

if ( ! empty( $attributes['show_plus_sign'] ) && $product->total_reviews > 0 ) {
	$total_reviews_html .= '+';
}

return 'file:./view.php';
