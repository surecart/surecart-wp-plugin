<?php


return [
	'title'      => __( 'Default Review List', 'surecart' ),
	'categories' => [ 'surecart_review_list' ],
	'blockTypes' => [ 'surecart/product-review-list' ],
	'priority'   => 1,
	'content'    => '

<!-- wp:surecart/product-review-list {"metadata":{"categories":["surecart_review_list"],"patternName":"surecart-product-review-standard","name":"Default Review List"}} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">Customer Reviews</h2>
<!-- /wp:heading -->

<!-- wp:surecart/product-review-summary -->
<!-- wp:group {"style":{"color":{"background":"#f7f9fb"},"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60","right":"var:preset|spacing|60"},"margin":{"bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group has-background" style="background-color:#f7f9fb;margin-bottom:var(--wp--preset--spacing--50);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"blockGap":"var:preset|spacing|30"},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","flexWrap":"nowrap","orientation":"vertical"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)"><!-- wp:surecart/product-average-rating {"style":{"spacing":{"blockGap":"var:preset|spacing|20"},"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","justifyContent":"left","orientation":"vertical"}} -->
<!-- wp:surecart/product-average-rating-value {"className":"is-style-slash"} /-->

<!-- wp:surecart/product-average-rating-stars /-->
<!-- /wp:surecart/product-average-rating -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-total-rating {"className":"is-style-default","style":{"spacing":{"blockGap":"var:preset|spacing|20","margin":{"right":"0","left":"0"},"padding":{"right":"0","left":"0"}}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:surecart/review-breakdown {"className":"is-style-default","style":{"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","justifyContent":"left","orientation":"horizontal"}} /--></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-review-summary -->

<!-- wp:surecart/product-review-list-content-header {"style":{"border":{"bottom":{"color":"#eeeeee","width":"1px"}},"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","orientation":"horizontal","verticalAlignment":"top","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<!-- wp:surecart/product-review-list-sidebar-toggle {"label":"Filters","style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:surecart/review-add-button {"width":100,"className":"is-style-fill","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}},"spacing":{"blockGap":"var:preset|spacing|30"}},"backgroundColor":"surecart","textColor":"white"} /--></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-review-list-content-header -->

<!-- wp:surecart/product-review-list-content {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}}} -->
<!-- wp:surecart/product-review-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"300px","type":"flex","orientation":"vertical"},"position":{"type":"sticky","top":"0px"},"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-surecart-product-review-list-sidebar"><!-- wp:surecart/product-review-list-filter-tags {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->
<!-- wp:surecart/product-review-list-filter-tags-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->

<!-- wp:surecart/product-review-list-filter-tags-template {"layout":{"type":"flex","orientation":"horizontal"}} -->
<!-- wp:surecart/product-review-list-filter-tag /-->
<!-- /wp:surecart/product-review-list-filter-tags-template -->

<!-- wp:surecart/product-review-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline"}}} /-->
<!-- /wp:surecart/product-review-list-filter-tags -->

<!-- wp:surecart/product-review-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->
<!-- wp:surecart/product-review-list-filter-checkboxes-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->

<!-- wp:surecart/product-review-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
<!-- wp:surecart/product-review-list-filter-checkbox /-->
<!-- /wp:surecart/product-review-list-filter-checkboxes-template -->
<!-- /wp:surecart/product-review-list-filter-checkboxes --></div>
<!-- /wp:surecart/product-review-list-sidebar -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group"><!-- wp:surecart/product-review-template {"style":{"spacing":{"blockGap":"0px","margin":{"top":"0","bottom":"0"},"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":1}} -->
<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20","padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"},"margin":{"top":"0","bottom":"0"}},"border":{"bottom":{"color":"#e5e7eb","width":"1px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="border-bottom-color:#e5e7eb;border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/review-reviewer-name {"style":{"spacing":{"padding":{"top":"0","bottom":"0"}},"typography":{"fontStyle":"normal","fontWeight":"500"}}} /-->

<!-- wp:surecart/review-verified-badge {"label":"Verified Buyer","icon_size":16,"style":{"typography":{"fontStyle":"normal","fontWeight":"400"},"spacing":{"blockGap":"var:preset|spacing|30"},"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","justifyContent":"center","verticalAlignment":"center","orientation":"horizontal"}} /--></div>
<!-- /wp:group -->

<!-- wp:surecart/review-date {"datetime":"2025-10-02T09:37:00.225Z","format":"human-diff"} /--></div>
<!-- /wp:group -->

<!-- wp:surecart/review-rating-stars /-->

<!-- wp:surecart/review-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}}} /-->

<!-- wp:surecart/review-content /--></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-review-template --></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-review-list-content -->

<!-- wp:surecart/product-review-list-no-reviews -->
<!-- wp:paragraph {"align":"left","placeholder":"Add text or blocks that will display when a query returns no reviews."} -->
<p class="has-text-align-left">No reviews yet, write one now?</p>
<!-- /wp:paragraph -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:surecart/review-add-button {"width":100,"className":"is-style-fill","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}},"spacing":{"blockGap":"var:preset|spacing|30"}},"backgroundColor":"surecart","textColor":"white"} /--></div>
<!-- /wp:group -->
<!-- /wp:surecart/product-review-list-no-reviews -->

<!-- wp:surecart/product-review-pagination -->
<!-- wp:surecart/product-review-pagination-previous /-->

<!-- wp:surecart/product-review-pagination-numbers /-->

<!-- wp:surecart/product-review-pagination-next /-->
<!-- /wp:surecart/product-review-pagination -->
<!-- /wp:surecart/product-review-list -->
',
];
