<?php

$product = get_query_var( 'surecart_current_product' );
if ( ! empty( $product ) ) {
	echo $product->id;
}
