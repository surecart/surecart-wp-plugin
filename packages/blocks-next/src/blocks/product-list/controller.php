<?php
use SureCart\Models\Product;
/**
 * PHP controller to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 */

$products = wp_interactivity_state( 'surecart/product-list' );

$products = Product::where(
	[
		'archived' => false,
		'status'   => ['published'],
		'expand'   => [
			'prices',
			'featured_product_media',
			'product_media.media'
		],
	]
)->get();

// return the view.
return 'file:./view.php';
