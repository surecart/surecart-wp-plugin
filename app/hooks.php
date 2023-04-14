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

add_action(
	'pre_get_posts',
	function( $wp_query ) {
		// Pages.
		$page_id = isset( $wp_query->query['page_id'] ) ? $wp_query->query['page_id'] : null;

		// Posts, including custom post types.
		$p = isset( $wp_query->query['p'] ) ? $wp_query->query['p'] : null;

		$post_id = $page_id ? $page_id : $p;
		$type    = get_post_type( $post_id );

		if ( 'wp_template' === $type ) {
			$wp_query->set( 'post_type', 'wp_template' );
		}
	}
);

// add_action(
// 'init',
// function() {

// register_post_type(
// 'surecart_template',
// array(
// 'labels'                => array(
// 'name'                  => _x( 'Templates', 'post type general name' ),
// 'singular_name'         => _x( 'Template', 'post type singular name' ),
// 'add_new'               => _x( 'Add New', 'Template' ),
// 'add_new_item'          => __( 'Add New Template' ),
// 'new_item'              => __( 'New Template' ),
// 'edit_item'             => __( 'Edit Template' ),
// 'view_item'             => __( 'View Template' ),
// 'all_items'             => __( 'Templates' ),
// 'search_items'          => __( 'Search Templates' ),
// 'parent_item_colon'     => __( 'Parent Template:' ),
// 'not_found'             => __( 'No templates found.' ),
// 'not_found_in_trash'    => __( 'No templates found in Trash.' ),
// 'archives'              => __( 'Template archives' ),
// 'insert_into_item'      => __( 'Insert into template' ),
// 'uploaded_to_this_item' => __( 'Uploaded to this template' ),
// 'filter_items_list'     => __( 'Filter templates list' ),
// 'items_list_navigation' => __( 'Templates list navigation' ),
// 'items_list'            => __( 'Templates list' ),
// ),
// 'description'           => __( 'Templates to include in your theme.' ),
// 'public'                => true,
// 'has_archive'           => true,
// 'show_ui'               => true,
// 'show_in_menu'          => true,
// 'show_in_rest'          => true,
// 'rewrite'               => true,
// 'rest_base'             => 'templates',
// 'rest_controller_class' => 'WP_REST_Templates_Controller',
// 'capability_type'       => array( 'template', 'templates' ),
// 'capabilities'          => array(
// 'create_posts'           => 'edit_theme_options',
// 'delete_posts'           => 'edit_theme_options',
// 'delete_others_posts'    => 'edit_theme_options',
// 'delete_private_posts'   => 'edit_theme_options',
// 'delete_published_posts' => 'edit_theme_options',
// 'edit_posts'             => 'edit_theme_options',
// 'edit_others_posts'      => 'edit_theme_options',
// 'edit_private_posts'     => 'edit_theme_options',
// 'edit_published_posts'   => 'edit_theme_options',
// 'publish_posts'          => 'edit_theme_options',
// 'read'                   => 'edit_theme_options',
// 'read_private_posts'     => 'edit_theme_options',
// ),
// 'map_meta_cap'          => true,
// 'supports'              => array(
// 'title',
// 'slug',
// 'excerpt',
// 'editor',
// 'revisions',
// 'author',
// ),
// )
// );
// }
// );
