<?php

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

$total_reviews_html = number_format_i18n( $product->total_reviews );

if ( ! empty( $attributes['show_plus_sign'] ) && $product->total_reviews > 0 ) {
	$total_reviews_html .= '+';
}

return 'file:./view.php';
