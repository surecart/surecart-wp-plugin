<?php
use SureCart\Models\Product;

$block_id     = (int) $block->context['surecart/product-list/blockId'] ?? '';
$url          = \SureCart::block()->urlParams( 'products', $block_id );
$query        = $url->getArg( 'search' );
$sort         = $url->getArg( 'sort' );
$collections  = $url->getArg( 'filter' );
$current_page = $url->getCurrentPage();
$type         = $attributes['type'] ?? 'all';
$ids          = $attributes['ids'] ?? [];

$params = [
	'archived'               => false,
	'status'                 => [ 'published' ],
	'expand'                 => [
		'prices',
		'featured_product_media',
		'product_media.media',
	],
	'sort'                   => $sort,
	'product_collection_ids' => $collections,
	'query'                  => $query,
];

if ( $type === 'custom' ) {
    $params['ids'] = $ids;
}

if ( $type === 'featured' ) {
    $params['featured'] = true;
}

// TODO: sorting by price is not available yet. We need to do this via the product post type metadata.
$products = Product::where( $params )->paginate(
	[
		'per_page' => $attributes['limit'] ?? 15,
		'page'     => $current_page,
	]
);

if ( is_wp_error( $products ) ) {
	return;
}

// build up pagination.
$next_page_link     = $products->hasNextPage() ? $url->addPageArg( $current_page + 1 ) : '';
$previous_page_link = $products->hasPreviousPage() ? $url->addPageArg( $current_page - 1 ) : '';

$pagination_pages = array_map(
	function( $i ) use ( $current_page, $url ) {
		return [
			'href'    => $url->addPageArg( $i ),
			'name'    => $i,
			'current' => (int) $i === (int) $current_page,
		];
	},
	range( 1, $products->totalPages() )
);

// this is needed to set the initial state on the server side for SSR.
wp_interactivity_state(
	'surecart/product-list',
	[
		'loading'   => false,
		'searching' => false,
	]
);

// return the view.
return 'file:./view.php';
