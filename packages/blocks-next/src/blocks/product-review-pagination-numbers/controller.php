<?php
$product = sc_get_product();
if ( empty( $product ) || empty( $product->total_reviews ) ) {
	return;
}

$query            = sc_product_review_list_query( $block, $product->id );
$pagination_links = $query->pagination_links;

// Render the block.
return 'file:./view.php';
