<?php
/**
 * Donation form block pattern
 */
return [
	'title'      => __( 'Carousel Fun', 'surecart' ),
	'categories' => [ 'surecart_shop' ],
	'blockTypes' => [ 'surecart/product-list' ],
	'content'    => '<!-- wp:surecart/product-list {"limit":3,"metadata":{"categories":["surecart_shop"],"patternName":"surecart-carousel-fun","name":"Carousel Fun"},"layout":{"type":"constrained"},"style":{"spacing":{"blockGap":"24px"}}} -->
<!-- wp:group {"className":"alignwide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:surecart/product-pagination {"showLabel":false} -->
<!-- wp:surecart/product-pagination-previous {"style":{"spacing":{"padding":{"top":"18px","bottom":"18px","left":"18px","right":"18px"}},"border":{"radius":"100px","color":"#4c4c4cd6","width":"1px"},"typography":{"lineHeight":"1"},"color":{"text":"#4c4c4cd6"},"elements":{"link":{"color":{"text":"#4c4c4cd6"}}}}} /-->
<!-- /wp:surecart/product-pagination -->

<!-- wp:heading {"textAlign":"center","className":"alignwide is-style-default","style":{"typography":{"textTransform":"none","fontStyle":"normal","fontWeight":"500","fontSize":"36px"},"layout":{"selfStretch":"fit","flexSize":null}},"fontFamily":"clash-display"} -->
<h2 class="wp-block-heading has-text-align-center alignwide is-style-default has-clash-display-font-family" style="font-size:36px;font-style:normal;font-weight:500;text-transform:none">Featured</h2>
<!-- /wp:heading -->

<!-- wp:surecart/product-pagination {"showLabel":false} -->
<!-- wp:surecart/product-pagination-next {"style":{"spacing":{"padding":{"top":"18px","bottom":"18px","left":"18px","right":"18px"}},"border":{"radius":"100px","color":"#4c4c4cd6","width":"1px"},"typography":{"lineHeight":"1"},"color":{"text":"#4c4c4cd6"},"elements":{"link":{"color":{"text":"#4c4c4cd6"}}}}} /-->
<!-- /wp:surecart/product-pagination --></div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-template {"style":{"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"blockGap":"20px"}},"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"},"margin":{"top":"0px","bottom":"0px"}},"dimensions":{"minHeight":"100%"},"border":{"radius":"10px"},"color":{"background":"#f7f3eb"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-background" style="border-radius:10px;background-color:#f7f3eb;min-height:100%;margin-top:0px;margin-bottom:0px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px"><!-- wp:group {"className":"ticss-596da6ff","style":{"position":{"type":"sticky","top":"0px"},"spacing":{"margin":{"bottom":"-100px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"right"}} -->
<div class="wp-block-group ticss-596da6ff" style="margin-bottom:-100px"><!-- wp:group {"className":"ticss-aef52ac1","style":{"layout":{"selfStretch":"fixed","flexSize":"90px"},"dimensions":{"minHeight":"90px"},"border":{"width":"1px","color":"#111111","radius":"100px"},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}},"typography":{"lineHeight":"0"},"position":{"type":""}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->
<div class="wp-block-group ticss-aef52ac1 has-border-color" style="border-color:#111111;border-width:1px;border-radius:100px;min-height:90px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;line-height:0"><!-- wp:surecart/product-list-price {"style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast-2"}}},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}},"layout":{"selfStretch":"fit"},"typography":{"fontStyle":"normal","fontWeight":"500"}},"textColor":"contrast-2","fontFamily":"clash-display"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:surecart/product-image {"aspectRatio":"1","style":{"spacing":{"margin":{"bottom":"14px"}},"border":{"radius":"10px"}}} /-->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-title {"level":2,"style":{"typography":{"fontSize":"1.3em","textTransform":"none","fontStyle":"normal","fontWeight":"500"},"spacing":{"margin":{"bottom":"0rem","top":"0px"}}},"fontFamily":"clash-display"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-template --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-list -->',
];
