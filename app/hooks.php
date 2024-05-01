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
	'init',
	function() {
		register_taxonomy(
			'custom_category',
			[ 'sc_product' ],
			[
				'label'             => __( 'Custom Category', 'surecart' ),
				'labels'            => [
					'name'              => _x( 'Custom Category', 'taxonomy general name', 'surecart' ),
					'singular_name'     => _x( 'Custom Category', 'taxonomy singular name', 'surecart' ),
					'search_items'      => __( 'Search Custom Category', 'surecart' ),
					'all_items'         => __( 'All Custom Category', 'surecart' ),
					'parent_item'       => __( 'Parent Custom Category', 'surecart' ),
					'parent_item_colon' => __( 'Parent Custom Category:', 'surecart' ),
					'edit_item'         => __( 'Edit Custom Category', 'surecart' ),
					'update_item'       => __( 'Update Custom Category', 'surecart' ),
					'add_new_item'      => __( 'Add New Custom Category', 'surecart' ),
					'new_item_name'     => __( 'New Custom Category Name', 'surecart' ),
					'menu_name'         => __( 'Custom Category', 'surecart' ),
				],
				'public'            => true,
				'show_in_rest'      => true,
				'hierarchical'      => false,
				'show_in_ui'        => true,
				// 'show_in_menu'      => false,
				'show_admin_column' => true,
				'rewrite'           => [
					'slug' => 'custom_category',
				],
			]
		);
	}
);
