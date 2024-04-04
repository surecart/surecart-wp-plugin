
<?php
use SureCart\Models\Product;

$block_id = (int) $attributes['blockId'] ?? '';
$page_key = 'products-' . $block_id . '-page';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
$per_page = $attributes['limit'] ?? 15;
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$filter = empty( $_GET[ $filter_key ] ) ? '' : sanitize_text_field( $_GET[ $filter_key ] );
$collection_ids = $filter ? explode( ',', $filter ) : [];

$products = Product::where(
	[
		'archived' => false,
		'status'   => ['published'],
		'expand' => [
			'prices',
			'featured_product_media',
			'product_media.media'
		],
	]
)->paginate(
	[
		'per_page' => $per_page,
		'page'     => $page,
	]
);

wp_interactivity_state(
	'surecart/product-list',
	array(
		$block_id => array (
			'products' => $products,
			'filter' => $collection_ids

		)
	),
);

for ($i = 1; $i <= $products->totalPages(); $i++) {
	$pages[] = [
		'href' => esc_url( add_query_arg( $page_key, $i ) ),
		'name' => $i,
		'key'  => 'product-pagination-numbers' . $i,
	];
}

// return the view.
return 'file:./view.php';