<?php
// no price in the context.
$price = $block->context['price'] ?? '';

if ( empty( $price ) || is_wp_error( $price ) ) {
	return '';
}

// get the display amount.
// translators: %1$s: amount, %2$s: interval.
$display_amount  = sprintf( esc_attr__( '%1$s %2$s', 'surecart' ), $price->display_amount, $price->short_interval_text );
$display_amount .= $price->short_interval_count_text;

// translators: %1$s: amount, %2$s: interval.
$screen_reader_text = sprintf( esc_attr__( 'Price: %1$s %2$s', 'surecart' ), $price->display_amount, $price->interval_text );
if ( ! empty( $price->payments_text ) ) {
	$screen_reader_text .= ' ' . $price->payments_text;
}

// return the view.
return 'file:./view.php';
