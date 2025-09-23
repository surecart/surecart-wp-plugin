<?php
/**
 * Declare any actions and filters here. USE THIS SPARINGLY.
 *
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package SureCart
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Don't let WordPress redirect guess our web routes.
 *
 * This prevents WordPress from finding a close match
 * to one of our web routes in the database and redirecting.
 */
add_filter(
	'do_redirect_guess_404_permalink',
	function ( $guess ) {
		if ( ( strpos( $_SERVER['REQUEST_URI'], '/' . untrailingslashit( \SureCart::settings()->permalinks()->getBase( 'buy_page' ) ) . '/' ) !== false ) ) {
			return false;
		}
		if ( ( strpos( $_SERVER['REQUEST_URI'], 'surecart/webhooks' ) !== false ) ) {
			return false;
		}
		if ( ( strpos( $_SERVER['REQUEST_URI'], 'surecart/redirect' ) !== false ) ) {
			return false;
		}
		return $guess;
	},
	9999999999
);

register_uninstall_hook( SURECART_PLUGIN_FILE, 'surecart_uninstall' );

/**
 * Uninstall.
 *
 * @return void
 */
function surecart_uninstall() {
	if ( (bool) get_option( 'sc_uninstall', false ) ) {
		\SureCart::activation()->uninstall();
	}
}

// redirect to an admin page that they can't access instead of homepage.
// Otherwise the homepage if they cannot access admin.
add_filter(
	'surecart.middleware.user.can.redirect_url',
	function ( $url ) {
		if ( current_user_can( 'read' ) ) {
			return get_admin_url() . 'admin.php?page=sc-denied';
		}
		return $url;
	}
);

add_action(
	'admin_init',
	function () {
		if ( isset( $_GET['test'] ) ) {
			$products = \SureCart\Models\Import::queue(
				'products',
				[
					[
						'name'    => 'AA New Product Import with Content',
						'status'  => 'published',
						'content' => '<!-- wp:group {"metadata":{"categories":["gallery"],"patternName":"core/three-columns-with-images-and-text","name":"Three columns with images and text"},"align":"full","style":{"color":{"background":"#f5eac1"},"spacing":{"padding":{"top":"6vw","bottom":"6vw","left":"6vw","right":"6vw"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignfull has-background" style="background-color:#f5eac1;padding-top:6vw;padding-right:6vw;padding-bottom:6vw;padding-left:6vw"><!-- wp:group {"style":{"spacing":{"blockGap":"16px","padding":{"right":"0","left":"0"}}},"layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap"}} -->
<div class="wp-block-group" style="padding-right:0;padding-left:0"><!-- wp:heading {"level":6,"style":{"color":{"text":"#000000"},"typography":{"fontSize":"16px"}},"anchor":"ecosystem"} -->
<h6 class="wp-block-heading has-text-color" id="ecosystem" style="color:#000000;font-size:16px">ECOSYSTEM</h6>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"lineHeight":"0.9","fontSize":"6vw","fontStyle":"normal","fontWeight":"700","textTransform":"none","textDecoration":"none","letterSpacing":"0px"},"color":{"text":"#000000"}}} -->
<p class="has-text-color" style="color:#000000;font-size:6vw;font-style:normal;font-weight:700;letter-spacing:0px;line-height:0.9;text-decoration:none;text-transform:none">Positive growth.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:spacer {"height":"1vw"} -->
<div style="height:1vw" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"3vw","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap"}} -->
<div class="wp-block-group alignwide" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"3vw","left":"3vw"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"33.38%"} -->
<div class="wp-block-column" style="flex-basis:33.38%"><!-- wp:paragraph {"style":{"color":{"text":"#000000"},"typography":{"fontSize":"17px"}}} -->
<p class="has-text-color" style="color:#000000;font-size:17px"><em>Nature</em>, in the common sense, refers to essences unchanged by man; space, the air, the river, the leaf.&nbsp;<em>Art</em>&nbsp;is applied to the mixture of his will with the same things, as in a house, a canal, a statue, a picture. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#000000"},"typography":{"fontSize":"17px"}}} -->
<p class="has-text-color" style="color:#000000;font-size:17px">But his operations taken together are so insignificant, a little chipping, baking, patching, and washing, that in an impression so grand as that of the world on the human mind, they do not vary the result.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"33%"} -->
<div class="wp-block-column" style="flex-basis:33%"><!-- wp:spacer {"height":"2vw"} -->
<div style="height:2vw" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://s.w.org/images/core/5.8/outside-01.jpg" alt="The sun setting through a dense forest."/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"33.62%"} -->
<div class="wp-block-column" style="flex-basis:33.62%"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://s.w.org/images/core/5.8/outside-02.jpg" alt="Wind turbines standing on a grassy plain, against a blue sky."/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"3vw"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"69%"} -->
<div class="wp-block-column" style="flex-basis:69%"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://s.w.org/images/core/5.8/outside-03.jpg" alt="The sun shining over a ridge leading down into the shore. In the distance, a car drives down a road."/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"33%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:33%"><!-- wp:spacer {"height":"2vw"} -->
<div style="height:2vw" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:paragraph {"style":{"color":{"text":"#000000"},"typography":{"fontSize":"17px"}}} -->
<p class="has-text-color" style="color:#000000;font-size:17px">Undoubtedly we have no questions to ask which are unanswerable. We must trust the perfection of the creation so far, as to believe that whatever curiosity the order of things has awakened in our minds, the order of things can satisfy. Every man\'s condition is a solution in hieroglyphic to those inquiries he would put.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
					],
				]
			);

			if ( is_wp_error( $products ) ) {
				var_dump( $products );
				exit;
			}
		}
	}
);
