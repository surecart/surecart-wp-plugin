<?php
/**
 * Donation form block pattern
 */
return [
	'title'      => __( 'Carousel', 'surecart' ),
	'categories' => [ 'surecart_shop' ],
	'blockTypes' => [ 'surecart/product-list' ],
	'content'    => '<!-- wp:surecart/product-list {"limit":3,"metadata":{"categories":["surecart_shop"],"patternName":"surecart-carousel","name":"Standard"},"style":{"spacing":{"blockGap":"24px"}}} -->
<!-- wp:group {"style":{"position":{"type":""}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","orientation":"horizontal","verticalAlignment":"bottom"}} -->
<div class="wp-block-group"><!-- wp:heading {"align":"wide","className":"is-style-asterisk"} -->
<h2 class="wp-block-heading alignwide is-style-asterisk">Shop Bestsellers</h2>
<!-- /wp:heading -->

<!-- wp:surecart/product-pagination {"showLabel":false,"style":{"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"blockGap":"18px"}},"layout":{"type":"flex","justifyContent":"space-between","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<!-- wp:surecart/product-pagination-previous {"style":{"spacing":{"padding":{"top":"18px","bottom":"18px","left":"18px","right":"18px"}},"border":{"radius":"100px","color":"#4c4c4cd6","width":"1px"},"typography":{"lineHeight":"1"},"color":{"text":"#4c4c4cd6"},"elements":{"link":{"color":{"text":"#4c4c4cd6"}}}}} /-->

<!-- wp:surecart/product-pagination-next {"style":{"spacing":{"padding":{"top":"18px","bottom":"18px","left":"18px","right":"18px"}},"border":{"radius":"100px","color":"#4c4c4cd6","width":"1px"},"typography":{"lineHeight":"1"},"color":{"text":"#4c4c4cd6"},"elements":{"link":{"color":{"text":"#4c4c4cd6"}}}}} /-->
<!-- /wp:surecart/product-pagination --></div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-template {"style":{"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"ticss-7226e6a2","style":{"border":{"radius":"8px"},"color":{"gradient":"linear-gradient(135deg,rgb(247,243,235) 0%,rgb(242,238,222) 100%)"},"spacing":{"margin":{"bottom":"14px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group ticss-7226e6a2 has-background" style="border-radius:8px;background:linear-gradient(135deg,rgb(247,243,235) 0%,rgb(242,238,222) 100%);margin-bottom:14px"><!-- wp:surecart/product-image {"aspectRatio":"1","style":{"border":{"radius":"8px"},"spacing":{"margin":{"bottom":"0px"}}}} /--></div>
<!-- /wp:group -->

<!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"1.5em"},"spacing":{"margin":{"bottom":"0.5rem","top":"0px"}}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"7px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-list-price {"style":{"elements":{"link":{"color":{"text":"var:preset|color|accent-3"}}}},"textColor":"accent-3"} /-->

<!-- wp:surecart/product-scratch-price /--></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-template --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-list -->',
];
