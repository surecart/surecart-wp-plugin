<?php
global $sc_product_quick_view_id;

$url        = \SureCart::block()->urlParams( 'product-quick-view' );
$product_id = $url->getArg( 'id' );
$args       = array(
	'p'         => $product_id,
	'post_type' => 'sc_product',
);
$query      = new WP_Query( $args );
if ( empty( $product_id ) || ! $query->have_posts() ) {
	return '';
}

return 'file:./view.php';
