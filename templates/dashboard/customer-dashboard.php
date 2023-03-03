<?php
/**
 * Customer dashboard pattern
 */
return [
	'title'      => __( 'Customer Dashboard', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/columns -->
	<sc-columns is-stacked-on-mobile="1" class="wp-block-surecart-columns"><!-- wp:surecart/column {"layout":{"type":"constrained","justifyContent":"center","contentSize":"100%"},"width":"33.33%","sticky":false,"style":{"color":{"background":"#f2fafc"},"spacing":{"blockGap":"var:preset|spacing|80","padding":{"top":"6.7rem","right":"6.7rem","bottom":"6.7rem","left":"6.7rem"}}}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-center has-background" style="background-color:#f2fafc;padding-top:6.7rem;padding-right:6.7rem;padding-bottom:6.7rem;padding-left:6.7rem;flex-basis:33.33%;--sc-column-content-width:100%;--sc-form-row-spacing:var:preset|spacing|80"><!-- wp:surecart/store-logo {"width":201} /-->

	<!-- wp:surecart/customer-store-links /-->

	<!-- wp:surecart/customer-login-logout /--></sc-column>
	<!-- /wp:surecart/column -->

	<!-- wp:surecart/column {"layout":{"type":"constrained","contentSize":"800px"},"width":"66.66%","style":{"spacing":{"blockGap":"0","padding":{"top":"var:preset|spacing|70","right":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|70"}}}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--70);flex-basis:66.66%;--sc-column-content-width:800px;--sc-form-row-spacing:0"><!-- wp:surecart/customer-dashboard -->
	<div style="font-size:16px;font-family:var(--sc-font-sans)" class="wp-block-surecart-customer-dashboard alignwide"><!-- wp:surecart/customer-subscriptions /-->

	<!-- wp:surecart/customer-downloads /-->

	<!-- wp:surecart/customer-payment-methods /-->

	<!-- wp:surecart/customer-orders /-->

	<!-- wp:surecart/customer-invoices /-->

	<!-- wp:surecart/customer-billing-details /--></div>
	<!-- /wp:surecart/customer-dashboard --></sc-column>
	<!-- /wp:surecart/column --></sc-columns>
	<!-- /wp:surecart/columns -->',
];
