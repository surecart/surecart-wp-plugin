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
		'expand'   => [
			'prices',
			'featured_product_media',
			'product_media.media'
		],
	]
)->get();

wp_interactivity_state(
	'surecart/product-list',
	array(
		'products' => $products,
	),
);

$styles = sc_get_block_styles();
$style = $styles['css'] ?? '';
$class = $styles['classnames'] ?? '';
$columns = $attributes['columns'] ?? 4;
$block_gap_css_var = $attributes['style']['spacing']['blockGap'] ? sc_get_block_gap_css_var( $attributes['style']['spacing']['blockGap'] ) : '40px';

// return the view.
return 'file:./view.php';
