<?php
/**
 * Classic Product Carousel block pattern.
 */
return [
	'title'      => __( 'Related Products Carousel', 'surecart' ),
	'categories' => [ 'surecart_related_products' ],
	'blockTypes' => [ 'surecart/product-list-related' ],
	'priority'   => 3,
	'content'    => '<!-- wp:surecart/product-list-related {"limit":null,"query":{"perPage":3,"pages":3,"offset":0,"postType":"sc_product","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"include":[],"sticky":"","related":true,"inherit":true,"taxQuery":null,"parents":[],"taxonomy":"sc_collection","totalPages":3,"fallback":true,"shuffle":true},"metadata":{"categories":["surecart_related_products"],"patternName":"surecart-related-carousel","name":"Related Products Carousel"},"align":"wide","layout":{"type":"constrained"},"style":{"spacing":{"margin":{"top":"40px"}}}} -->
<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"bottom":"30px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide" style="margin-bottom:30px;padding-right:0px;padding-left:0px"><!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group" style="padding-right:0px;padding-left:0px"><!-- wp:surecart/product-pagination {"showLabel":false,"style":{"typography":{"fontSize":"32px"}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
<!-- wp:surecart/product-pagination-previous /-->
<!-- /wp:surecart/product-pagination --></div>
<!-- /wp:group -->

<!-- wp:heading {"textAlign":"center","level":3,"className":"is-style-default","style":{"typography":{"fontSize":"32px"}}} -->
<h3 class="wp-block-heading has-text-align-center is-style-default" style="font-size:32px">You may also like
		</h3>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group" style="padding-right:0px;padding-left:0px"><!-- wp:surecart/product-pagination {"showLabel":false,"style":{"typography":{"fontSize":"32px"}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
<!-- wp:surecart/product-pagination-next /-->
<!-- /wp:surecart/product-pagination --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:surecart/product-template {"align":"wide","style":{"spacing":{"blockGap":"30px"}},"layout":{"type":"grid","columnCount":3,"minimumColumnWidth":null}} -->
<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"color":{"background":"#0000000d"},"border":{"radius":"10px"},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-background" style="border-radius:10px;background-color:#0000000d;margin-top:0px;margin-bottom:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><!-- wp:cover {"useFeaturedImage":true,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top right","isDark":false,"style":{"dimensions":{"aspectRatio":"3/4"},"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"margin":{"bottom":"15px"}},"border":{"radius":"10px"}},"layout":{"type":"default"}} -->
<div class="wp-block-cover is-light has-custom-content-position is-position-top-right" style="border-radius:10px;margin-bottom:15px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:surecart/product-sale-badge {"style":{"typography":{"fontSize":"12px"},"border":{"radius":"100px"}}} /--></div></div>
<!-- /wp:cover --></div>
<!-- /wp:group -->

<!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"bottom":"5px","top":"0px"}}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em","margin":{"top":"0px","bottom":"0px"},"padding":{"right":"0px","left":"0px"}},"margin":{"top":"0px","bottom":"0px"},"typography":{"lineHeight":"1"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group" style="margin-top:0px;margin-bottom:0px;padding-right:0px;padding-left:0px;line-height:1"><!-- wp:surecart/product-list-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /-->

<!-- wp:surecart/product-scratch-price {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"5px","bottom":"5px"}}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-template -->
<!-- /wp:surecart/product-list-related -->',
];
