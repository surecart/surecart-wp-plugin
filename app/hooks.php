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
		$products = new \WP_Query(
			[
				'post_type' => 'sc_product',
			]
		);

		while ( $products->have_posts() ) :
			$products->the_post();

			// get the product in the loop.
			$product = sc_get_product();

			the_title( '<h2>', '</h2>' );

			echo wp_kses_post( '<p>' . $product->display_price . '</p>' );

			$stock = $product->available_stock ?? 0;
			if ( $stock < 1 ) {
				echo wp_kses_post( '<p>Out of stock</p>' );
			} elseif ( $stock < 10 ) {
				echo wp_kses_post( '<p>Low stock</p>' );
			} else {
				echo wp_kses_post( '<p>In stock</p>' );
			}

			the_excerpt();

		endwhile;
	}
);

// add_filter(
// 'get_post_metadata',
// function( $metadata, $object_id, $meta_key, $single, $meta_type ) {
// if ( 'sc_product' === get_post_type( $object_id ) && 'display_price' === $meta_key ) {
// $prices = get_posts(
// array(
// 'post_type'      => 'sc_price',
// 'post_parent'    => $object_id,
// 'posts_per_page' => -1, // Get all related posts.
// )
// );
// return Currency::format( $prices[0]->amount, $prices[0]->currency ?? 'usd' );
// }
// return $metadata;
// },
// 9,
// 5
// );

// function add_prices_to_sc_product( $post ) {
// global $wpdb;

// Check if the post is an 'sc_product'
// if ( 'sc_product' === get_post_type( $post ) ) {
// Get the related 'sc_price' posts
// $price_posts = get_posts(
// array(
// 'post_type'      => 'sc_price',
// 'post_parent'    => $post->ID,
// 'posts_per_page' => -1, // Get all related posts
// )
// );

// Add the prices array to the post object
// $post->prices = $price_posts;
// }
// }
// add_action( 'the_post', 'add_prices_to_sc_product' );

// function add_prices_to_sc_product_posts( $posts, $query ) {
// Check if we're in the main query and dealing with 'sc_product' post type.
// if ( 'sc_product' === $query->get( 'post_type' ) ) {
// Gather the IDs of the sc_product posts.
// $product_ids = wp_list_pluck( $posts, 'ID' );

// Fetch all sc_price posts whose parent is in the sc_product posts.
// $price_posts = get_posts(
// array(
// 'post_type'       => 'sc_price',
// 'post_parent__in' => $product_ids,
// 'posts_per_page'  => -1,
// 'nopaging'        => true,
// )
// );

// Map sc_price posts to their respective sc_product.
// $prices_by_product = array();
// foreach ( $price_posts as $price_post ) {
// $prices_by_product[ $price_post->post_parent ][] = $price_post;
// }

// Assign prices array to each sc_product post.
// foreach ( $posts as $post ) {
// if ( 'sc_product' === get_post_type( $post ) ) {
// $post->prices = $prices_by_product[ $post->ID ] ?? array();
// }
// }
// }

// return $posts;
// }
// add_filter( 'posts_results', 'add_prices_to_sc_product_posts', 10, 2 );
