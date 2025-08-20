<?php
/**
 * Product List Sidebar block pattern.
 */
return [
	'title'      => __( 'Product List Sidebar', 'surecart' ),
	'categories' => [ 'surecart_shop' ],
	'blockTypes' => [ 'surecart/product-list' ],
	'priority'   => 1,
	'content'    => '<!-- wp:surecart/product-list {"limit":null,"query":{"perPage":9,"pages":0,"offset":0,"postType":"sc_product","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"include":[],"sticky":"","inherit":true,"taxQuery":null,"parents":[]},"metadata":{"categories":["surecart_shop"],"patternName":"surecart-list-sidebar","name":"Product List Sidebar"},"align":"wide"} -->
<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-list-sidebar-toggle {"label":"Filters"} /-->

<!-- wp:surecart/product-list-search {"style":{"layout":{"selfStretch":"fixed","flexSize":"300px"}}} /--></div>
<!-- /wp:group -->

<!-- wp:surecart/product-list-content {"layout":{"type":"flex","orientation":"horizontal","verticalAlignment":"top","flexWrap":"nowrap"}} -->
<!-- wp:surecart/product-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"225px"},"spacing":{"blockGap":"30px"},"position":{"type":"sticky","top":"0px"}}} -->
<!-- wp:surecart/product-list-filter-tags {"layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:surecart/product-list-filter-tags-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal","fontSize":"16px"}}} /-->

<!-- wp:surecart/product-list-filter-tags-template {"style":{"spacing":{"blockGap":"8px"},"typography":{"fontSize":"16px"}}} -->
<!-- wp:surecart/product-list-filter-tag {"style":{"typography":{"fontSize":"14px"}}} /-->
<!-- /wp:surecart/product-list-filter-tags-template -->

<!-- wp:surecart/product-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline","fontWeight":"700","fontStyle":"normal"}},"fontSize":"small"} /-->
<!-- /wp:surecart/product-list-filter-tags -->

<!-- wp:surecart/product-list-sort-radio-group {"layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"8px"}}} -->
<!-- wp:surecart/product-list-sort-radio-group-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal","fontSize":"16px"}}} /-->

<!-- wp:surecart/product-list-sort-radio-group-template {"style":{"spacing":{"blockGap":"6px"},"typography":{"fontSize":"16px"}}} -->
<!-- wp:surecart/product-list-sort-radio {"style":{"typography":{"fontSize":"16px"}}} /-->
<!-- /wp:surecart/product-list-sort-radio-group-template -->
<!-- /wp:surecart/product-list-sort-radio-group -->

<!-- wp:surecart/product-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"8px"}}} -->
<!-- wp:surecart/product-list-filter-checkboxes-label {"label":"Collections","style":{"typography":{"fontWeight":"700","fontStyle":"normal","fontSize":"16px"}}} /-->

<!-- wp:surecart/product-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"6px","margin":{"top":"0","bottom":"0"}},"typography":{"fontSize":"16px"}}} -->
<!-- wp:surecart/product-list-filter-checkbox {"style":{"typography":{"fontSize":"16px"}}} /-->
<!-- /wp:surecart/product-list-filter-checkboxes-template -->
<!-- /wp:surecart/product-list-filter-checkboxes -->
<!-- /wp:surecart/product-list-sidebar -->

<!-- wp:surecart/product-template-container {"layout":{"type":"default"},"style":{"layout":{"selfStretch":"fill","flexSize":null}}} -->
<!-- wp:surecart/product-template {"style":{"spacing":{"blockGap":"30px"},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"grid","columnCount":null,"minimumColumnWidth":"225px"}} -->
<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"color":{"background":"#0000000d"},"border":{"radius":"10px"},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-background" style="border-radius:10px;background-color:#0000000d;margin-top:0px;margin-bottom:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><!-- wp:cover {"useFeaturedImage":true,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top center","isDark":false,"style":{"dimensions":{"aspectRatio":"3/4"},"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"margin":{"bottom":"15px"}},"border":{"radius":"10px"}},"layout":{"type":"default"}} -->
<div class="wp-block-cover is-light has-custom-content-position is-position-top-center" style="border-radius:10px;margin-bottom:15px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-quick-view-button {"style":{"spacing":{"padding":{"top":"10px","bottom":"10px","left":"10px","right":"10px"}},"typography":{"fontSize":"12px","lineHeight":"1"},"elements":{"link":{"color":{"text":"var:preset|color|black"}}},"border":{"radius":"100px"}},"backgroundColor":"white","textColor":"black"} /-->

<!-- wp:surecart/product-sale-badge {"style":{"typography":{"fontSize":"12px"},"border":{"radius":"100px"},"layout":{"selfStretch":"fit","flexSize":null}}} /--></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:group -->

<!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"bottom":"5px","top":"0px"}}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em","margin":{"top":"0px","bottom":"0px"}},"margin":{"top":"0px","bottom":"0px"},"typography":{"lineHeight":"1"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group" style="margin-top:0px;margin-bottom:0px;line-height:1"><!-- wp:surecart/product-list-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /-->

<!-- wp:surecart/product-scratch-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-template -->

<!-- wp:surecart/product-list-no-products -->
<!-- wp:paragraph {"align":"center","placeholder":"Add text or blocks that will display when a query returns no products."} -->
<p class="has-text-align-center">No products found.</p>
<!-- /wp:paragraph -->
<!-- /wp:surecart/product-list-no-products -->
<!-- /wp:surecart/product-template-container -->
<!-- /wp:surecart/product-list-content -->

<!-- wp:surecart/product-pagination -->
<!-- wp:surecart/product-pagination-previous /-->

<!-- wp:surecart/product-pagination-numbers /-->

<!-- wp:surecart/product-pagination-next /-->
<!-- /wp:surecart/product-pagination -->
<!-- /wp:surecart/product-list -->',
];
