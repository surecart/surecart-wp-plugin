
<?php
use SureCart\Models\Product;

$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$page_key = isset( $block_id ) ? 'products-' . $block_id . '-page' : 'products-page';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
$sort_key = isset( $block_id ) ? 'products-' . $block_id . '-sort' : 'products-sort';
$sort = empty( $_GET[ $sort_key ] ) ? 'created_at:desc' : sanitize_text_field( $_GET[ $sort_key ] );
$search_key = isset( $block_id ) ? 'products-' . $block_id . '-search' : 'products-search';
$search = empty( $_GET[ $search_key ] ) ? '' : sanitize_text_field( $_GET[ $search_key ] );
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$filter = empty( $_GET[ $filter_key ] ) ? '' : array_map('sanitize_text_field', $_GET[ $filter_key ]);

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
		'product_collection_ids' => $filter,
		'query'    => $search,
	]
)->paginate(
	[
		'per_page' => $attributes['limit'] ?? 15,
		'page'     => $page,
	]
);

if ( is_wp_error( $products ) ) {
	return;
}

// build up pagination.
$pages = array_map(function($i) use ($page_key) {
	return [
		'href' => esc_url(add_query_arg($page_key, $i)),
		'name' => $i,
		'key'  => 'product-pagination-numbers' . $i,
	];
}, range(1, $products->totalPages()));

$next_page_link = $products->hasNextPage() ? esc_url(add_query_arg($page_key, $page + 1)) : "";
$previous_page_link =$products->hasPreviousPage() ? esc_url(add_query_arg($page_key, $page - 1)) : "";

// return the view.
return 'file:./view.php';
