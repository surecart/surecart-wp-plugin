<?php
/**
 * Product List Filters in Sidebar block pattern.
 */
return [
	'title'      => __( 'Product List Filters in Sidebar', 'surecart' ),
	'categories' => [ 'surecart_shop' ],
	'blockTypes' => [ 'surecart/product-list' ],
	'priority'   => 1,
	'content'    => '<!-- wp:surecart/product-list {"limit":null} -->
<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-list-sidebar-toggle /--></div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-list-sort {"style":{"layout":{"selfStretch":"fit","flexSize":null}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:surecart/product-list-content -->
<!-- wp:surecart/product-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"20%"}}} -->
<!-- wp:surecart/product-list-filter-checkboxes {"style":{"spacing":{"blockGap":"0","margin":{"top":"0","bottom":"var:preset|spacing|10"}}}} -->
<!-- wp:surecart/product-list-filter-checkbox /-->
<!-- /wp:surecart/product-list-filter-checkboxes -->
<!-- /wp:surecart/product-list-sidebar -->

<!-- wp:surecart/product-template {"style":{"spacing":{"blockGap":"30px"},"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"grid","columnCount":4}} -->
<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"color":{"background":"#0000000d"},"border":{"radius":"10px"},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-background" style="border-radius:10px;background-color:#0000000d;margin-top:0px;margin-bottom:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><!-- wp:cover {"useFeaturedImage":true,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top right","isDark":false,"style":{"dimensions":{"aspectRatio":"3/4"},"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"margin":{"bottom":"15px"}},"border":{"radius":"10px"}},"layout":{"type":"default"}} -->
<div class="wp-block-cover is-light has-custom-content-position is-position-top-right" style="border-radius:10px;margin-bottom:15px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:surecart/product-sale-badge {"style":{"typography":{"fontSize":"12px"},"border":{"radius":"100px"}}} /--></div></div>
<!-- /wp:cover --></div>
<!-- /wp:group -->

<!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"bottom":"5px","top":"0px"}}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em","margin":{"top":"0px","bottom":"0px"}},"margin":{"top":"0px","bottom":"0px"},"typography":{"lineHeight":"1"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group" style="margin-top:0px;margin-bottom:0px;line-height:1"><!-- wp:surecart/product-list-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /-->

<!-- wp:surecart/product-scratch-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-template -->
<!-- /wp:surecart/product-list-content -->

<!-- wp:surecart/product-pagination -->
<!-- wp:surecart/product-pagination-previous /-->

<!-- wp:surecart/product-pagination-numbers /-->

<!-- wp:surecart/product-pagination-next /-->
<!-- /wp:surecart/product-pagination -->
<!-- /wp:surecart/product-list -->',
];
