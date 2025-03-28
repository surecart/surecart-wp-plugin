<?php
// get product.

use SureCart\Models\Blocks\ProductPageBlock;

$product = sc_get_product();
global $post;

if ( ! empty( $attributes['product_post_id'] ) ) {
	$current_post = get_post( absint( $attributes['product_post_id'] ) );

	if ( $current_post instanceof \WP_Post ) {
		$product = sc_get_product( $current_post );
		$post    = $current_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		setup_postdata( $post ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
	}
}

$controller = new ProductPageBlock();
$state      = $controller->state();
$context    = $controller->context();

wp_interactivity_state( 'surecart/product-page', $state );

return 'file:./view.php';
