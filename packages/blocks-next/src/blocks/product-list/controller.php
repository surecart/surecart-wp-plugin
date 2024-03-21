
<?php
use SureCart\Models\Product;

$block_id = $attributes['blockId'] ?? '';
$page_key = $block_id ? 'products-' . $block_id . '-page' : 'products-page';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
$per_page = $attributes['limit'] ?? 15;

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
)->paginate(
	[
		'per_page' => $per_page,
		'page'     => $page,
	]
);

wp_interactivity_state(
	'surecart/product-list',
	array(
		'products' => $products,
	),
);
$block_id = $attributes['blockId'] ?? 4;

// return the view.
return 'file:./view.php';