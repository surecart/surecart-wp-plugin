<?php
/**
 * Product Page with Image on Right block pattern.
 */
return [
	'title'      => __( 'Product Page with Image on Right', 'surecart' ),
	'categories' => [ 'surecart_product_page' ],
	'blockTypes' => [ 'surecart/product-page' ],
	'priority'   => 1,
	'content'    => '<!-- wp:surecart/product-page {"align":"wide"} -->
<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"60px"}}}} -->
<div class="wp-block-columns"><!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%"><!-- wp:surecart/product-collection-tags -->
<!-- wp:surecart/product-collection-tag /-->
<!-- /wp:surecart/product-collection-tags -->

<!-- wp:surecart/product-title /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-selected-price-scratch-amount {"style":{"typography":{"textDecoration":"line-through","fontSize":"24px"},"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->

<!-- wp:surecart/product-selected-price-amount {"style":{"typography":{"fontSize":"24px"}}} /-->

<!-- wp:surecart/product-sale-badge {"style":{"border":{"radius":"15px"},"typography":{"fontSize":"12px"},"layout":{"selfStretch":"fit","flexSize":null},"elements":{"link":{"color":{"text":"#fff"}}}},"textColor":"white"} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-selected-price-trial {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->

<!-- wp:surecart/product-selected-price-fees {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:surecart/product-description /-->

<!-- wp:surecart/product-variant-pills -->
<!-- wp:surecart/product-variant-pill /-->
<!-- /wp:surecart/product-variant-pills -->

<!-- wp:surecart/product-price-chooser -->
<!-- wp:surecart/product-price-choice-template {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:surecart/price-name /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"right"}} -->
<div class="wp-block-group"><!-- wp:surecart/price-amount {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}}} /-->

<!-- wp:surecart/price-trial {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}},"fontSize":"small"} /-->

<!-- wp:surecart/price-setup-fee {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}},"fontSize":"small"} /--></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-price-choice-template -->
<!-- /wp:surecart/product-price-chooser -->

<!-- wp:surecart/product-quantity /-->

<!-- wp:surecart/product-selected-price-ad-hoc-amount /-->

<!-- wp:surecart/product-buy-buttons -->
<div class="wp-block-surecart-product-buy-buttons wp-block-buttons sc-block-buttons is-layout-flex"><!-- wp:surecart/product-buy-button {"add_to_cart":true,"text":"Add To Cart"} /-->

<!-- wp:surecart/product-buy-button {"text":"Buy Now","style":"outline"} /--></div>
<!-- /wp:surecart/product-buy-buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%"><!-- wp:surecart/product-media /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
<!-- /wp:surecart/product-page -->',
];
