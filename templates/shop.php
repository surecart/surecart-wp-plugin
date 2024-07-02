<?php
/**
 * Shop page block template.
 */
return [
	'title'      => __( 'Cart', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:group {"align":"wide","layout":{"inherit":true,"type":"constrained"}} -->
	<div class="wp-block-group alignwide"><!-- wp:group {"align":"wide"} -->
	<div class="wp-block-group alignwide"><!-- wp:surecart/product-list -->
	<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->
	<div class="wp-block-group" style="margin-bottom:10px"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group"><!-- wp:surecart/product-list-sort /-->

	<!-- wp:surecart/product-list-filter /--></div>
	<!-- /wp:group -->

	<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group"><!-- wp:surecart/product-list-search /--></div>
	<!-- /wp:group --></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group" style="margin-bottom:10px"><!-- wp:surecart/product-list-filter-tags -->
	<!-- wp:surecart/product-list-filter-tag /-->
	<!-- /wp:surecart/product-list-filter-tags --></div>
	<!-- /wp:group -->

	<!-- wp:surecart/product-template {"layout":{"type":"grid","columnCount":3}} -->
	<!-- wp:group -->
	<div class="wp-block-group"><!-- wp:surecart/product-image /-->

	<!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"1.25em"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /-->

	<!-- wp:surecart/product-list-price /--></div>
	<!-- /wp:group -->
	<!-- /wp:surecart/product-template -->

	<!-- wp:surecart/product-pagination -->
	<!-- wp:surecart/product-pagination-previous /-->

	<!-- wp:surecart/product-pagination-numbers /-->

	<!-- wp:surecart/product-pagination-next /-->
	<!-- /wp:surecart/product-pagination -->
	<!-- /wp:surecart/product-list --></div>
	<!-- /wp:group --></div>
	<!-- /wp:group -->',
];
