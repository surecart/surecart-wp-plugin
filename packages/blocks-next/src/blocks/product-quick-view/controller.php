<?php
$url        = \SureCart::block()->urlParams( 'product-quick-view' );
$product_id = $url->getArg( 'id' );
$args       = array(
	'p'         => $product_id,
	'post_type' => 'sc_product',
);
$query      = new WP_Query( $args );

return 'file:./view.php';
