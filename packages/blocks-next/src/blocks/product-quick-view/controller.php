<?php
global $sc_product_quick_view_id;

$url        = \SureCart::block()->urlParams( 'product-quick-view' );
$product_id = $url->getArg( 'id' );
$args       = [
	'post__in'  => ! empty( $product_id ) ? [ $product_id ] : [ 0 ], // Ensures no posts are found if null.
	'post_type' => 'sc_product',
];
$query      = new WP_Query( $args );

return 'file:./view.php';
