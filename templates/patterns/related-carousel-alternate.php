<?php
/**
 * Classic Product Carousel block pattern.
 */
return [
	'title'      => __( 'Related Products Carousel (Alternate)', 'surecart' ),
	'categories' => [ 'surecart_related_products' ],
	'blockTypes' => [ 'surecart/product-list-related' ],
	'priority'   => 4,
	'content'    => '<!-- wp:surecart/product-list-related {"limit":null,"query":{"perPage":3,"pages":3,"offset":0,"postType":"sc_product","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"include":[],"sticky":"","related":true,"inherit":true,"taxQuery":null,"parents":[],"taxonomy":"sc_collection","totalPages":3,"fallback":true,"shuffle":true},"metadata":{"categories":["surecart_related_products"],"patternName":"surecart-related-carousel-alternate","name":"Related Products Carousel"},"layout":{"type":"constrained"},"style":{"spacing":{"margin":{"top":"40px"}}}} -->
<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"bottom":"30px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group alignwide" style="margin-bottom:30px;padding-right:0px;padding-left:0px">
	<!-- wp:heading {"textAlign":"center","level":3,"className":"is-style-default","style":{"typography":{"fontSize":"34px"}}} -->
	<h3 class="wp-block-heading has-text-align-center is-style-default" style="font-size:34px">You may also like
	</h3>
	<!-- /wp:heading -->

	<!-- wp:surecart/product-pagination {"paginationArrow":"chevron","showLabel":false,"style":{"typography":{"fontSize":"24px"},"spacing":{"blockGap":"10px"}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
	<!-- wp:surecart/product-pagination-previous {"style":{"spacing":{"padding":{"top":"15px","bottom":"15px","left":"15px","right":"15px"}},"border":{"radius":"9999px","color":"#9ca3af","width":"1px"}}} /-->

	<!-- wp:surecart/product-pagination-next {"style":{"spacing":{"padding":{"top":"15px","bottom":"15px","left":"15px","right":"15px"}},"border":{"radius":"9999px","color":"#9ca3af","width":"1px"}}} /-->
	<!-- /wp:surecart/product-pagination -->
</div>
<!-- /wp:group -->

<!-- wp:surecart/product-template {"align":"wide","style":{"spacing":{"blockGap":"30px"}},"layout":{"type":"grid","columnCount":3,"minimumColumnWidth":null}} -->
<!-- wp:group {"style":{"spacing":{"blockGap":"0px","padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"}},"border":{"radius":"10px","color":"#9da4b030","width":"1px"},"dimensions":{"minHeight":"100%"}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group has-border-color has-white-background-color has-background"
	style="border-color:#9da4b030;border-width:1px;border-radius:10px;min-height:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
	<!-- wp:group {"style":{"color":{"background":"#0000000d"},"border":{"radius":{"topLeft":"10px","topRight":"10px","bottomLeft":"0px","bottomRight":"0px"}},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px"}}},"layout":{"type":"default"}} -->
	<div class="wp-block-group has-background"
		style="border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;background-color:#0000000d;margin-top:0px;margin-bottom:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
		<!-- wp:cover {"useFeaturedImage":true,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top right","isDark":false,"style":{"dimensions":{"aspectRatio":"1"},"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"margin":{"top":"0px","bottom":"0px"}},"border":{"radius":{"topLeft":"10px","topRight":"10px","bottomLeft":"0px","bottomRight":"0px"}}},"layout":{"type":"default"}} -->
		<div class="wp-block-cover is-light has-custom-content-position is-position-top-right"
			style="border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;margin-top:0px;margin-bottom:0px">
			<span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim"></span>
			<div class="wp-block-cover__inner-container">
				<!-- wp:surecart/product-sale-badge {"style":{"typography":{"fontSize":"12px"},"border":{"radius":"100px"}}} /-->
			</div>
		</div>
		<!-- /wp:cover -->
	</div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"spacing":{"padding":{"right":"20px","left":"20px","top":"20px","bottom":"20px"},"blockGap":"10px"}},"layout":{"type":"flex","orientation":"vertical"}} -->
	<div class="wp-block-group" style="padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px">
		<!-- wp:surecart/product-collection-tags {"style":{"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
		<!-- wp:surecart/product-collection-tag {"isLink":false,"style":{"color":{"background":"#ffffff00","text":"#454f66cf"},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px"}},"typography":{"fontStyle":"normal","fontWeight":"400","fontSize":"10px","letterSpacing":"1px","textTransform":"uppercase","lineHeight":"1"},"elements":{"link":{"color":{"text":"#454f66cf"}}}}} /-->
		<!-- /wp:surecart/product-collection-tags -->

		<!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} /-->

		<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em","margin":{"top":"0px","bottom":"0px"},"padding":{"right":"0px","left":"0px"}},"margin":{"top":"0px","bottom":"0px"},"typography":{"lineHeight":"1"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
		<div class="wp-block-group"
			style="margin-top:0px;margin-bottom:0px;padding-right:0px;padding-left:0px;line-height:1">
			<!-- wp:surecart/product-list-price {"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"bottom":"0px","top":"0px"}}}} /-->

			<!-- wp:surecart/product-scratch-price {"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"bottom":"0px","top":"0px"}}}} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
<!-- /wp:surecart/product-template -->
<!-- /wp:surecart/product-list-related -->',
];
