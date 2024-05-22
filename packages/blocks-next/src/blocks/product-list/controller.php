<?php
$block_id       = (int) $block->context['surecart/product-list/blockId'] ?? '';
$url            = \SureCart::block()->urlParams( 'products' )->setInstanceId( $block_id );
$query          = $url->getArg( 'search' );
$query_order    = $url->getArg( 'order' );
$query_order_by = $url->getArg( 'orderby' );
$collections    = $url->getArg( 'sc_collection' );
$current_page   = $url->getCurrentPage();

$query = [
	'post_type'           => 'sc_product',
	'status'              => 'publish',
	'ignore_sticky_posts' => 1, // TODO: only if this is featured (we make featured sticky)
	'posts_per_page'      => $attributes['limit'] ?? 15,
	'paged'               => $current_page,
	'order'               => $query_order ?? 'desc',
	'orderby'             => $query_order_by ?? 'date',
	's'                   => $query,
];

// put together price query.
if ( 'price' === $query_order_by ) {
	$query['meta_key'] = 'max_price_amount';
	$query['orderby']  = 'meta_value_num';
}

if ( ! empty( $collections ) ) {
	$query['tax_query'] = [
		[
			'taxonomy' => 'sc_collection',
			'field'    => 'term_id',
			'terms'    => $collections,
		],
	];
}

$products_query = new \WP_Query( $query );

// handle errors.
if ( is_wp_error( $products_query ) ) {
	$content = $products_query->get_error_message();
	return 'file:./error.php';
}

$product_posts = $products_query->posts;

// map the products.
$products = array_map(
	function( $post ) {
		return sc_get_product( $post );
	},
	$product_posts
);

// build up pagination.
$next_page_link     = $products_query->max_num_pages && $products_query->max_num_pages !== $current_page ? $url->addPageArg( $current_page + 1 )->url() : '';
$previous_page_link = $current_page > 1 ? $url->addPageArg( $current_page - 1 )->url() : '';
$pagination         = array_map(
	function( $i ) use ( $current_page, $url ) {
		return [
			'href'    => $url->addPageArg( $i )->url(),
			'name'    => $i,
			'current' => (int) $i === (int) $current_page,
		];
	},
	range( 1, $products_query->max_num_pages )
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
