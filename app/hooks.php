<?php
/**
 * Declare any actions and filters here.
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package SureCart
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// register uninstall.
register_uninstall_hook( SURECART_PLUGIN_FILE, 'surecart_uninstall' );
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

// Theme option (dark/light) apply on HTML tag.
add_filter(
	'language_attributes',
	function( $output, $doctype ) {
		if ( 'html' !== $doctype ) {
			return $output;
		}
		$output .= ' class="surecart-theme-' . get_option( 'surecart-theme-data', 'surecart-theme-light' ) . '"';
	
		return $output;
	},
	10,
	2
);