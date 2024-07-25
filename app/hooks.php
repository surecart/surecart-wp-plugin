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


// add_filter( 'bricks/dynamic_tags_list', 'add_my_tag_to_builder' );
// function add_my_tag_to_builder( $tags ) {
// Ensure your tag is unique (best to prefix it)
// $tags[] = [
// 'name'  => '{sc_media}',
// 'label' => esc_attr__( 'SureCart Media', 'surecart' ),
// 'group' => 'SureCart',
// ];

// return $tags;
// }


// add_filter( 'bricks/dynamic_data/render_tag', 'get_my_tag_value', 10, 3 );
// function get_my_tag_value( $tag, $post, $context = 'text' ) {

// $blocks = [
// 'sc_media' => 'surecart/product-media',
// ];

// if ( ! isset( $blocks[ $tag ] ) ) {
// return $tag;
// }

// $argument   = str_replace( $tag . ':', '', $tag );
// $arguments  = explode( ',', $argument );
// $assoc_args = [];
// foreach ( $arguments as $arg ) {
// $parts              = explode( '=', $arg );
// $key                = $parts[0];
// $value              = $parts[1] ?? '';
// $assoc_args[ $key ] = $value;
// }

// return do_blocks( '<!-- wp:' . $blocks[ $tag ] . ' ' . wp_json_encode( [ $argument ], JSON_FORCE_OBJECT ) . ' --><!-- /wp:' . $blocks[ $tag ] . ' -->' );
// }

// add_filter( 'bricks/dynamic_data/render_content', 'render_my_tag', 10, 3 );
// add_filter( 'bricks/frontend/render_data', 'render_my_tag', 10, 2 );
// function render_my_tag( $content, $post, $context = 'text' ) {

// $blocks = [
// '{sc_media}' => 'surecart/product-media',
// ];

// foreach ( $blocks as $block => $tag ) {
// if ( strpos( $content, $block ) === false ) {
// continue;
// }

// $rendered = renderBlock( $tag );

// $content = str_replace( $block, $rendered, $content );
// }

// return $content;
// }

// function renderBlock( $name, $attributes = [] ) {
// return do_blocks( '<!-- wp:' . $name . ' ' . wp_json_encode( $attributes, JSON_FORCE_OBJECT ) . ' --><!-- /wp:' . $name . ' -->' );
// }
