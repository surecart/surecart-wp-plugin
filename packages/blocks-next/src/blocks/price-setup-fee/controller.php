<?php
// no price in the context.
if ( empty( $block->context['sc_product_price'] ) ) {
	return '';
}

$price = $block->context['sc_product_price'];

if ( is_wp_error( $price ) ) {
	return '';
}

if ( empty( $price->setup_fee_text ) ) {
	return '';
}

// return the view.
return 'file:./view.php';
