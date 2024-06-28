<?php
// no price in the context.
if ( empty( $block->context['sc_product_price'] ) ) {
	return '';
}

// get the price.
$price = $block->context['sc_product_price'];
if ( is_wp_error( $price ) ) {
	return '';
}

// return the view.
return 'file:./view.php';
