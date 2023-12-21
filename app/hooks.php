<?php
/**
 * Declare any actions and filters here. USE THIS SPARINGLY.
 *
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package SureCart
 */

use SureCart\Models\Posts\Relation;
use SureCart\Support\Currency;

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
	function( $guess ) {
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
	function( $url ) {
		if ( current_user_can( 'read' ) ) {
			return get_admin_url() . 'admin.php?page=sc-denied';
		}
		return $url;
	}
);


add_action(
	'wp',
	function() {
		return false;
		$products = sc_query_products(
			[
				'post_status'    => 'publish',
				'posts_per_page' => 10,
			]
		);

		while ( $products->have_posts() ) :
			$products->the_post();

			global $sc_product;
			// or
			// $product = sc_get_product();

			the_title( '<h2>', '</h2>' );

			echo wp_kses_post( '<p>' . $sc_product->display_price . '</p>' );

			the_post_thumbnail( 'medium' );

			if ( $sc_product->is_out_of_stock ) {
				echo wp_kses_post( '<p>Out of stock</p>' );
			} else {
				if ( $sc_product->is_low_stock ) {
					echo wp_kses_post( '<p>Low stock</p>' );
				} else {
					echo wp_kses_post( '<p>In stock</p>' );
				}
			}

			// $stock = $sc_product->isInStock ?? 0;
			// if ( $stock < 1 ) {
			// echo wp_kses_post( '<p>Out of stock</p>' );
			// } elseif ( $stock < 10 ) {
			// echo wp_kses_post( '<p>Low stock</p>' );
			// } else {
			// echo wp_kses_post( '<p>In stock</p>' );
			// }

			the_excerpt();

		endwhile;
	}
);
