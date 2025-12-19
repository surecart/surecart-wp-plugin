<?php
$product = sc_get_product();

// If there are no reviews, skip rendering the block.
if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

return 'file:./view.php';
