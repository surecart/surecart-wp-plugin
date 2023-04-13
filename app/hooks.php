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

// TODO: Move to product controller maybe.
add_filter(
	'query_vars',
	function( $vars ) {
		$vars[] = 'surecart_current_product';
		return $vars;
	}
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


// function wp1482371_custom_post_type_args( $args, $post_type ) {
// if ( $post_type === 'wp_template' ) {
// $args['public']       = true;
// $args['sbow_in_menu'] = true;
// }

// flush_rewrite_rules();

// return $args;
// }
// add_filter( 'register_post_type_args', 'wp1482371_custom_post_type_args', 20, 2 );

// add_action(
// 'elementor/documents/register',
// function( $documents_manager ) {
// $documents_manager->register_document_type( 'surecart', \Elementor\Modules\Library\Documents\Page::get_class_full_name() );
// }
// );

// add_action(
// 'pre_get_posts',
// function() {
// var_dump( get_query_var( 'post' ) );
// }
// );
