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

$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$page_key = isset( $block_id ) ? 'products-' . $block_id . '-page' : 'products-page';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
$sort_key = isset( $block_id ) ? 'products-' . $block_id . '-sort' : 'products-sort';
$sort = empty( $_GET[ $sort_key ] ) ? 'created_at:desc' : sanitize_text_field( $_GET[ $sort_key ] );
$search_key = isset( $block_id ) ? 'products-' . $block_id . '-search' : 'products-search';
$search = empty( $_GET[ $search_key ] ) ? '' : sanitize_text_field( $_GET[ $search_key ] );
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$filter = empty( $_GET[ $filter_key ] ) ? '' : sanitize_text_field( $_GET[ $filter_key ] );
$collection_ids = $filter ? explode( ',', $filter ) : [];
$per_page = $block->context["surecart/product-list/limit"] ?? 15;

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
		'product_collection_ids' => $collection_ids,
		'query'    => $search,
	]
)->paginate(
	[
		'per_page' => $per_page,
		'page'     => $page,
	]
);

$products = $products->data;

// return the view.
return 'file:./view.php';
