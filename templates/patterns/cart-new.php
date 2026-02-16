<?php
/**
 * Staggered Product List Pattern
 */
return [
	'title'      => __( 'Cart (Simple)', 'surecart' ),
	'categories' => [ 'surecart_cart' ],
	'blockTypes' => [ 'surecart/slide-out-cart' ],
	'priority'   => 2,
	'content'    => '<!-- wp:surecart/slide-out-cart {"metadata":{"categories":["surecart_cart"],"patternName":"surecart-cart-new","name":"Cart"},"style":{"typography":{"fontSize":"15px"},"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5em","bottom":"0em","left":"2em","right":"2em"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group" style="padding-top:1.5em;padding-right:2em;padding-bottom:0em;padding-left:2em"><!-- wp:surecart/cart-close-button {"style":{"typography":{"lineHeight":"1"}}} /-->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px","lineHeight":"1","fontStyle":"normal","fontWeight":"500"},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px","left":"0px","right":"0px"}}}} -->
<p style="margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;font-size:16px;font-style:normal;font-weight:500;line-height:1">Review My Order</p>
<!-- /wp:paragraph -->

<!-- wp:surecart/cart-count {"style":{"layout":{"selfStretch":"fit","flexSize":null},"typography":{"lineHeight":"1","fontWeight":"600","fontSize":"14px","fontStyle":"normal"},"spacing":{"padding":{"top":"6px","bottom":"6px","left":"10px","right":"10px"}},"border":{"radius":"4px"}}} /--></div>
<!-- /wp:group -->

<!-- wp:group {"className":"sc-cart-scrollable","style":{"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"default"}} -->
<div class="wp-block-group sc-cart-scrollable"><!-- wp:surecart/slide-out-cart-line-items {"border":false,"padding":{"top":"0em","right":"0em","bottom":"0em","left":"0em"},"metadata":{"ignoredHookedBlocks":["surecart/cart-line-item-divider"]},"style":{"spacing":{"padding":{"top":"2em","bottom":"2em","left":"2em","right":"2em"},"blockGap":"2em"}}} -->
<!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null},"dimensions":{"minHeight":""}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"stretch"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-line-item-image {"aspectRatio":"1","width":"","height":"","style":{"layout":{"selfStretch":"fixed","flexSize":"80px"},"border":{"width":"1px","radius":"4px"},"color":{"duotone":"unset"},"spacing":{"margin":{"top":"0","bottom":"0"}}}} /-->

<!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null},"spacing":{"blockGap":"5px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null},"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"stretch","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null},"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-line-item-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"500","lineHeight":"1.4","textDecoration":"none"}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-line-item-price-name {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->

<!-- wp:surecart/cart-line-item-variant {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->

<!-- wp:surecart/cart-line-item-note {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /--></div>
<!-- /wp:group -->

<!-- wp:surecart/cart-line-item-status {"style":{"typography":{"textAlign":"right"}}} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"4px"},"typography":{"lineHeight":"1.4"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"right"}} -->
<div class="wp-block-group" style="line-height:1.4"><!-- wp:surecart/cart-line-item-scratch-amount /-->

<!-- wp:surecart/cart-line-item-amount {"style":{"typography":{"fontStyle":"normal","fontWeight":"500","textAlign":"right"}}} /-->

<!-- wp:surecart/cart-line-item-interval {"style":{"typography":{"fontSize":"14px"}}} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-line-item-trial {"style":{"typography":{"fontSize":"14px","textAlign":"right"}}} /-->

<!-- wp:surecart/cart-line-item-fees {"style":{"typography":{"fontSize":"14px","textAlign":"right"}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-line-item-quantity /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"right"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-line-item-remove {"style":{"typography":{"fontSize":"14px","fontStyle":"normal","fontWeight":"400"}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:surecart/slide-out-cart-line-items -->

</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"0em","bottom":"0em","left":"0em","right":"0em"}},"border":{"top":{"color":"#b0b0b069","width":"1px"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group" style="border-top-color:#b0b0b069;border-top-width:1px;padding-top:0em;padding-right:0em;padding-bottom:0em;padding-left:0em"><!-- wp:surecart/cart-order-bumps {"style":{"spacing":{"padding":{"top":"1.5em","bottom":"1.5em","left":"2em","right":"2em"}},"border":{"right":{},"bottom":{"color":"#b0b0b069","width":"1px"},"left":{}}}} -->
<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"0.75em"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group" style="margin-bottom:0.75em"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"500"},"spacing":{"margin":{"top":"0","bottom":"0"}}}} -->
<p style="margin-top:0;margin-bottom:0;font-style:normal;font-weight:500">Suggested for you</p>
<!-- /wp:paragraph -->

<!-- wp:surecart/cart-order-bump-pagination {"style":{"spacing":{"blockGap":"0.25em"}}} -->
<!-- wp:surecart/cart-order-bump-pagination-previous /-->

<!-- wp:surecart/cart-order-bump-pagination-next /-->
<!-- /wp:surecart/cart-order-bump-pagination --></div>
<!-- /wp:group -->

<!-- wp:surecart/cart-order-bump-template {"style":{"spacing":{"blockGap":"0.75em"}},"layout":{"type":"flex"}} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.75em","bottom":"0.75em","left":"0.75em","right":"1em"}},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group" style="padding-top:0.75em;padding-right:1em;padding-bottom:0.75em;padding-left:0.75em"><!-- wp:surecart/cart-order-bump-image {"width":"72px","style":{"border":{"radius":"8px"},"layout":{"selfStretch":"fixed","flexSize":"72px"}}} /-->

<!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null},"spacing":{"blockGap":"2px"}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-order-bump-title {"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"600","lineHeight":"1.3"}}} /-->

<!-- wp:surecart/cart-order-bump-description {"style":{"typography":{"fontSize":"13px","lineHeight":"1.3"},"color":{"text":"#6b7280"}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/cart-order-bump-scratch-amount {"style":{"typography":{"fontSize":"14px"}}} /-->

<!-- wp:surecart/cart-order-bump-amount {"style":{"typography":{"fontSize":"14px","fontWeight":"500"}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:surecart/cart-order-bump-add-button {"style":{"typography":{"fontSize":"18px","fontWeight":"400","fontStyle":"normal"},"border":{"radius":{"topLeft":"74.6%","topRight":"74.6%","bottomLeft":"74.6%","bottomRight":"74.6%"},"width":"1px","color":"#d1d5db"},"spacing":{"padding":{"top":"0.5em","bottom":"0.5em","left":"0.5em","right":"0.5em"}}}} /--></div>
<!-- /wp:group -->
<!-- /wp:surecart/cart-order-bump-template -->
<!-- /wp:surecart/cart-order-bumps -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"2em","bottom":"2em","left":"2em","right":"2em"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-top:2em;padding-right:2em;padding-bottom:2em;padding-left:2em"><!-- wp:surecart/slide-out-cart-items-subtotal {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"500","fontSize":"18px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="margin-top:0px;margin-bottom:0px;font-size:18px;font-style:normal;font-weight:500;line-height:1.4">Subtotal</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"},"color":{"text":"var(\u002d\u002dsc-input-help-text-color)"},"elements":{"link":{"color":{"text":"var(\u002d\u002dsc-input-help-text-color)"}}}}} -->
<p class="has-text-color has-link-color" style="color:var(--sc-input-help-text-color);font-size:14px;line-height:1.4">Taxes &amp; shipping calculated at checkout</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:surecart/cart-subtotal-amount {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"500","lineHeight":"1.4"}}} /-->
<!-- /wp:surecart/slide-out-cart-items-subtotal -->

<!-- wp:surecart/slide-out-cart-items-submit {"style":{"border":{"radius":"4px"}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:surecart/slide-out-cart -->',
];
