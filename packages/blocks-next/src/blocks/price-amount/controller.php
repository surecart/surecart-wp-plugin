<?php
// no price in the context.
if ( empty( $block->context['sc_product_price'] ) ) {
	return '';
}
$price = $block->context['sc_product_price'];
if ( is_wp_error( $price ) ) {
	return '';
}

// get the display amount.
$display_amount = sprintf( esc_attr__( '%1$s %2$s', 'surecart' ), $price->display_amount, $price->short_interval_text );

// return the view.
return 'file:./view.php';
