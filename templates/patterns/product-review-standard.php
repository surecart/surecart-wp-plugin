<?php

// Translatable strings.
$customer_reviews = esc_html__( 'Customer Reviews', 'surecart' );
$based_on         = esc_html__( 'Based on', 'surecart' );
$no_reviews_yet   = esc_html__( 'No reviews yet.', 'surecart' );
$filters          = esc_attr__( 'Filters', 'surecart' );
$verified_buyer   = esc_attr__( 'Verified Buyer', 'surecart' );

return [
	'title'      => __( 'Default Review List', 'surecart' ),
	'categories' => [ 'surecart_review_list' ],
	'blockTypes' => [ 'surecart/product-review-list' ],
	'priority'   => 1,
	'content'    => '
	<!-- wp:surecart/product-review-list {"metadata":{"categories":["surecart_review_list"],"patternName":"surecart-product-review-standard","name":"Default Review List"},"align":"wide","layout":{"type":"constrained"}} -->
	<!-- wp:heading {"className":"wp-block-heading","style":{"spacing":{"margin":{"top":"32px","bottom":"32px"}},"typography":{"lineHeight":"1"}}} -->
	<h2 class="wp-block-heading" style="margin-top:32px;margin-bottom:32px;line-height:1">' . $customer_reviews . '</h2>
	<!-- /wp:heading -->

	<!-- wp:surecart/product-reviews -->
	<!-- wp:surecart/product-review-summary {"style":{"spacing":{"margin":{"bottom":"15px"}}}} -->
	<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"20px"}}}} -->
	<div class="wp-block-columns"><!-- wp:column {"verticalAlignment":"center","width":"280px"} -->
	<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:280px"><!-- wp:group {"style":{"spacing":{"blockGap":"14px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","flexWrap":"nowrap","orientation":"vertical","verticalAlignment":"center"}} -->
	<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:group {"style":{"spacing":{"blockGap":"5px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"bottom"}} -->
	<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:surecart/product-review-average-rating-value {"className":"is-style-none","style":{"typography":{"fontStyle":"normal","fontWeight":"600","lineHeight":"1","fontSize":"24px"}}} /-->

	<!-- wp:paragraph {"metadata":{"name":"/ 5.0"},"style":{"typography":{"lineHeight":"1.5","fontSize":"14px"},"color":{"text":"#4b5563"},"elements":{"link":{"color":{"text":"#4b5563"}}},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"margin":{"top":"0","bottom":"0"}}}} -->
	<p class="has-text-color has-link-color" style="color:#4b5563;font-size:14px;line-height:1.5;padding-top:0;padding-bottom:0;padding-left:0;padding-right:0;margin-top:0;margin-bottom:0">/ 5.0</p>
	<!-- /wp:paragraph --></div>
	<!-- /wp:group -->

	<!-- wp:surecart/product-review-average-rating-stars /-->

	<!-- wp:group {"style":{"spacing":{"blockGap":"5px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:paragraph {"metadata":{"name":"Based on"},"style":{"typography":{"fontSize":"14px"},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"margin":{"top":"0","bottom":"0"}}}} -->
	<p style="font-size:14px;padding-top:0;padding-bottom:0;padding-left:0;padding-right:0;margin-top:0;margin-bottom:0">' . $based_on . '</p>
	<!-- /wp:paragraph -->

	<!-- wp:surecart/product-review-total-rating {"link_to_reviews":false,"className":"is-style-default","style":{"spacing":{"blockGap":"4px","margin":{"right":"0","left":"0"},"padding":{"right":"0","left":"0"}}}} /--></div>
	<!-- /wp:group --></div>
	<!-- /wp:group --></div>
	<!-- /wp:column -->

	<!-- wp:column {"verticalAlignment":"center"} -->
	<div class="wp-block-column is-vertically-aligned-center"><!-- wp:surecart/product-review-breakdown {"columns":2,"className":"is-style-default","layout":{"type":"flex","justifyContent":"left","orientation":"horizontal","verticalAlignment":"center"}} /--></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns -->
	<!-- /wp:surecart/product-review-summary -->

	<!-- wp:group {"metadata":{"name":"Header"},"style":{"spacing":{"margin":{"bottom":"10px"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
	<div class="wp-block-group" style="margin-bottom:10px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:surecart/product-review-list-sidebar-toggle {"label":"' . $filters . '"} /-->

	<!-- wp:surecart/product-review-add-button {"width":100,"className":"is-style-fill","style":{"elements":{"link":{"color":{"text":"#ffffff"}}}},"backgroundColor":"surecart","textColor":"white"} /--></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
	<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:surecart/product-review-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"280px"},"position":{"type":"sticky","top":"0px"},"spacing":{"blockGap":"30px"}},"layout":{"type":"flex","orientation":"vertical"}} -->
	<!-- wp:surecart/product-review-list-filter-tags {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->
	<!-- wp:surecart/product-review-list-filter-tags-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal","fontSize":"16px"}}} /-->

	<!-- wp:surecart/product-review-list-filter-tags-template {"style":{"spacing":{"blockGap":"8px"},"typography":{"fontSize":"16px"}},"layout":{"type":"flex","orientation":"horizontal"}} -->
	<!-- wp:surecart/product-review-list-filter-tag {"style":{"typography":{"fontSize":"14px"}}} /-->
	<!-- /wp:surecart/product-review-list-filter-tags-template -->

	<!-- wp:surecart/product-review-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline","fontWeight":"700","fontStyle":"normal"}},"fontSize":"small"} /-->
	<!-- /wp:surecart/product-review-list-filter-tags -->

	<!-- wp:surecart/product-review-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"8px"}}} -->
	<!-- wp:surecart/product-review-list-filter-checkboxes-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal","fontSize":"16px"}}} /-->

	<!-- wp:surecart/product-review-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"6px","margin":{"top":"0","bottom":"0"}},"typography":{"fontSize":"16px"}},"layout":{"type":"flex","orientation":"vertical"}} -->
	<!-- wp:surecart/product-review-list-filter-checkbox {"style":{"typography":{"fontSize":"16px"}}} /-->
	<!-- /wp:surecart/product-review-list-filter-checkboxes-template -->
	<!-- /wp:surecart/product-review-list-filter-checkboxes -->
	<!-- /wp:surecart/product-review-list-sidebar -->

	<!-- wp:group {"style":{"spacing":{"blockGap":"0px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
	<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:surecart/product-review-template {"style":{"spacing":{"blockGap":"0px","margin":{"top":"0","bottom":"0"},"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":1}} -->
	<!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"top":"24px","bottom":"24px","right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"border":{"bottom":{"color":"#e5e7eb","width":"1px"}}},"layout":{"type":"constrained","contentSize":"100%"}} -->
	<div class="wp-block-group" style="border-bottom-color:#e5e7eb;border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:24px;padding-bottom:24px;padding-right:0px;padding-left:0px"><!-- wp:group {"className":"sc-review-header-group","style":{"spacing":{"margin":{"top":"0","bottom":"16px"},"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
	<div class="wp-block-group sc-review-header-group" style="margin-top:0;margin-bottom:16px;padding-right:0px;padding-left:0px"><!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px"><!-- wp:surecart/product-review-reviewer-name {"style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"right":"8px"}},"typography":{"fontStyle":"normal","fontWeight":"500","fontSize":"16px"}}} /-->

	<!-- wp:surecart/product-review-verified-badge {"label":"' . $verified_buyer . '","style":{"typography":{"fontStyle":"normal","fontWeight":"400","fontSize":"16px"},"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","justifyContent":"center","verticalAlignment":"center","orientation":"horizontal"}} /--></div>
	<!-- /wp:group -->

	<!-- wp:surecart/product-review-date {"datetime":"2025-10-02T09:37:00.225Z","format":"human-diff","style":{"typography":{"fontSize":"14px"}}} /--></div>
	<!-- /wp:group -->

	<!-- wp:surecart/product-review-rating-stars {"style":{"spacing":{"margin":{"bottom":"16px"}}}} /-->

	<!-- wp:surecart/product-review-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"700","fontSize":"18px"},"spacing":{"margin":{"bottom":"8px"}}}} /-->

	<!-- wp:surecart/product-review-content {"style":{"typography":{"fontSize":"16px"}}} /--></div>
	<!-- /wp:group -->
	<!-- /wp:surecart/product-review-template -->

	<!-- wp:surecart/product-review-pagination {"style":{"spacing":{"margin":{"top":"30px","bottom":"30px"}}}} -->
	<!-- wp:surecart/product-review-pagination-previous /-->

	<!-- wp:surecart/product-review-pagination-numbers /-->

	<!-- wp:surecart/product-review-pagination-next /-->
	<!-- /wp:surecart/product-review-pagination --></div>
	<!-- /wp:group --></div>
	<!-- /wp:group -->
	<!-- /wp:surecart/product-reviews -->

	<!-- wp:surecart/product-review-list-no-reviews -->
	<!-- wp:paragraph {"align":"left","placeholder":"Add text or blocks that will display when a query returns no reviews."} -->
	<p class="has-text-align-left">' . $no_reviews_yet . '</p>
	<!-- /wp:paragraph -->

	<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:surecart/product-review-add-button {"width":100,"className":"is-style-fill","style":{"elements":{"link":{"color":{"text":"#ffffff"}}}},"backgroundColor":"surecart","textColor":"white"} /--></div>
	<!-- /wp:group -->
	<!-- /wp:surecart/product-review-list-no-reviews -->
	<!-- /wp:surecart/product-review-list -->
',
];
