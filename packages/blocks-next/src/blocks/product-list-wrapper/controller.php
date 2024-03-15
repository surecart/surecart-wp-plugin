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

$products = Product::where(
	[
		'archived' => false,
		'status'   => ['published'],
	]
)->get();

wp_interactivity_state(
	'surecart/product-list',
	array(
		'products' => $products,
	),
);

// return the view.
return 'file:./view.php';
