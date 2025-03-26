<?php
// get product.

use SureCart\Models\Blocks\ProductPageBlock;

$product = sc_get_product();
global $post;

if ( ! empty( $attributes['product_id'] ) ) {
	$product = \SureCart\Models\Product::with( [ 'image', 'prices', 'product_medias', 'product_media.media', 'variants', 'variant_options' ] )->find( $attributes['product_id'] );


	if ( ! empty( $product->post->ID ) ) {
		$current_post = get_post( $product->post->ID );
		if ( $current_post instanceof \WP_Post ) {
			$post = $current_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			setup_postdata( $post ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}
	}
}

$controller = new ProductPageBlock();
$state      = $controller->state();
$context    = $controller->context();

wp_interactivity_state( 'surecart/product-page', $state );

return 'file:./view.php';
