<?php
/**
 * Shop page block template.
 */
return [
	'title'      => __( 'Shop', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/product-list -->
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

<!-- wp:surecart/product-template {"style":{"spacing":{"blockGap":"30px"}},"layout":{"type":"grid","columnCount":4}} -->
<!-- wp:group -->
<div class="wp-block-group"><!-- wp:surecart/product-image {"style":{"spacing":{"margin":{"bottom":"15px"}}}} /-->

<!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em","margin":{"top":"0px","bottom":"0px"}},"margin":{"top":"0px","bottom":"0px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group" style="margin-top:0px;margin-bottom:0px"><!-- wp:surecart/product-list-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /-->

<!-- wp:surecart/product-scratch-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-template -->

<!-- wp:surecart/product-pagination -->
<!-- wp:surecart/product-pagination-previous /-->

<!-- wp:surecart/product-pagination-numbers /-->

<!-- wp:surecart/product-pagination-next /-->
<!-- /wp:surecart/product-pagination -->
<!-- /wp:surecart/product-list -->',
];
