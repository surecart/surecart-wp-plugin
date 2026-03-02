<?php

$product = sc_get_product();

if ( get_query_var( 'sc_upsell_id' ) ) {
	return 'file:./upsell-quantity.php';
}

if ( ! empty( $content ) ) {
	return 'file:./view.php';
}

$attributes['label'] = $attributes['label'] ?? __( 'Quantity', 'surecart' );

$styles = sc_get_block_styles( false );

// return the view.
return 'file:./legacy.php';
