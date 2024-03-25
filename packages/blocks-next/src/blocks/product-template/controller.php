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

$block_id = $block->context["surecart/product-list/blockId"];
$page_key = isset( $block_id ) ? 'products-' . $block_id . '-page' : 'products-page';
$sort_key = isset( $block_id ) ? 'products-' . $block_id . '-sort' : 'products-sort';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
$sort = empty( $_GET[ $sort_key ] ) ? 'created_at:desc' : sanitize_text_field( $_GET[ $sort_key ] );
$per_page = $block->context["surecart/product-list/limit"] ?? 15;

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
		'sort'     => $sort,
	]
)->paginate(
	[
		'per_page' => $per_page,
		'page'     => $page,
	]
);

$products = $products->data;

$styles = sc_get_block_styles();
$style = $styles['css'] ?? '';
$class = $styles['classnames'] ?? '';
$columns = $block->context["surecart/product-list/columns"] ?? 4;
$block_gap_css_var = $attributes['style']['spacing']['blockGap'] ? sc_get_block_gap_css_var( $attributes['style']['spacing']['blockGap'] ) : '40px';

// return the view.
return 'file:./view.php';
