<?php
/**
 * Customer dashboard pattern
 */
return [
	'title'      => __( 'Customer Dashboard', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/columns {"isFullHeight":true} -->
	<sc-columns is-stacked-on-mobile="1" is-full-height="1" class="wp-block-surecart-columns"><!-- wp:surecart/column {"layout":{"type":"constrained","justifyContent":"left"},"width":"33.33%","sticky":true,"className":"sc-temp-left-section","style":{"color":{"background":"#f2fafc"},"spacing":{"padding":{"top":"6.7rem","right":"6.7rem","bottom":"6.7rem","left":"6.7rem"}}}} -->
	<sc-column class="wp-block-surecart-column is-sticky is-layout-constrained is-horizontally-aligned-left sc-temp-left-section has-background" style="background-color:#f2fafc;padding-top:6.7rem;padding-right:6.7rem;padding-bottom:6.7rem;padding-left:6.7rem;flex-basis:33.33%"><!-- wp:surecart/store-logo {"width":201} /-->

	<!-- wp:heading -->
	<h2><strong>The new way to sell on WordPress.</strong></h2>
	<!-- /wp:heading -->

	<!-- wp:surecart/columns {"className":"sc-temp-pin","style":{"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"0"}}}} -->
	<sc-columns is-stacked-on-mobile="1" class="wp-block-surecart-columns sc-temp-pin" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:surecart/column {"layout":{"type":"default"}} -->
	<sc-column class="wp-block-surecart-column"><!-- wp:surecart/customer-store-links {"color":"var(\u002d\u002dast-global-color-1)"} /-->

	<!-- wp:surecart/customer-login-logout /--></sc-column>
	<!-- /wp:surecart/column --></sc-columns>
	<!-- /wp:surecart/columns -->

	<!-- wp:html -->
	<style>
	.sc-temp-left-section {
		flex-direction: column;
		display: flex;
		height: 100vh;
	}

	.sc-temp-pin {
		margin-top: auto !important;
	}

	</style>
	<!-- /wp:html --></sc-column>
	<!-- /wp:surecart/column -->

	<!-- wp:surecart/column {"layout":{"type":"constrained","contentSize":"800px"},"width":"66.66%","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","right":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|70"}}}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--70);flex-basis:66.66%;--sc-column-content-width:800px"><!-- wp:surecart/customer-dashboard -->
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
