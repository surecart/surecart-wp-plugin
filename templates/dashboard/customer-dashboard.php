<?php
/**
 * Customer dashboard pattern
 */
return [
	'title'      => __( 'Customer Dashboard', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/customer-dashboard -->
<div style="font-size:16px;font-family:var(--sc-font-sans)" class="wp-block-surecart-customer-dashboard alignwide"><!-- wp:surecart/columns {"isFullHeight":true,"backgroundColor":"white","style":{"spacing":{"blockGap":{"top":"0px","left":"0px"}}}} -->
<sc-columns is-stacked-on-mobile="1" is-full-height="1" class="wp-block-surecart-columns has-white-background-color has-background" style="gap:0px 0px"><!-- wp:surecart/column {"layout":{"type":"default"},"width":"250px","sticky":true,"className":"sc-temp-left-section","style":{"spacing":{"blockGap":"40px","padding":{"top":"0rem","right":"0rem","bottom":"0rem","left":"0rem"}}}} -->
<sc-column class="wp-block-surecart-column is-sticky sc-temp-left-section" style="padding-top:0rem;padding-right:0rem;padding-bottom:0rem;padding-left:0rem;flex-basis:250px;--sc-form-row-spacing:40px"><!-- wp:group {"tagName":"header","style":{"spacing":{"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}}},"layout":{"type":"constrained"}} -->
<header class="wp-block-group" style="padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:surecart/store-logo {"width":220,"height":27,"maxHeight":null,"style":{}} /--></header>
<!-- /wp:group -->

<!-- wp:surecart/customer-store-links {"color":"var(\u002d\u002dast-global-color-1)"} /-->

<!-- wp:group {"style":{"border":{"radius":"4px","top":{"color":"#d9e2e2","width":"1px"}},"spacing":{"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}}},"className":"sc-temp-pin","layout":{"type":"constrained"}} -->
<div class="wp-block-group sc-temp-pin" style="border-radius:4px;border-top-color:#d9e2e2;border-top-width:1px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:surecart/customer-login-logout /--></div>
<!-- /wp:group --></sc-column>
<!-- /wp:surecart/column -->

<!-- wp:surecart/column {"layout":{"type":"constrained","contentSize":"700px","justifyContent":"center"},"width":"","style":{"spacing":{"padding":{"top":"4rem","right":"4rem","bottom":"4rem","left":"4rem"},"blockGap":"40px"},"color":{"background":"#f9fafb"},"border":{"color":"#d9e2e2","width":"1px"}}} -->
<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-center has-border-color has-background" style="border-color:#d9e2e2;border-width:1px;background-color:#f9fafb;padding-top:4rem;padding-right:4rem;padding-bottom:4rem;padding-left:4rem;--sc-column-content-width:700px;--sc-form-row-spacing:40px"><!-- wp:surecart/dashboard-page -->

<!-- wp:surecart/customer-subscriptions /-->

<!-- wp:surecart/customer-orders /-->

<!-- wp:surecart/customer-downloads /-->

<!-- wp:surecart/customer-payment-methods /-->

<!-- wp:surecart/customer-billing-details /-->
<!-- /wp:surecart/dashboard-page --></sc-column>
<!-- /wp:surecart/column --></sc-columns>
<!-- /wp:surecart/columns --></div>
<!-- /wp:surecart/customer-dashboard -->',
];
