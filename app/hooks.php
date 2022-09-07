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

function sc_register_settings() {
	register_setting(
		'general',
		'sc_recaptcha_site_key',
		array(
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	register_setting(
		'general',
		'sc_recaptcha_secret_key',
		array(
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	register_setting(
		'general',
		'sc_recaptcha_min_score',
		array(
			'type'              => 'number',
			'show_in_rest'      => true,
			'default'           => 0.5,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
}
add_action( 'admin_init', 'sc_register_settings' );
add_action( 'rest_api_init', 'sc_register_settings' );

if ( ! empty( get_option( 'sc_recaptcha_site_key', true ) ) ) {
	/**
	 * SC Google ReCaptcha
	 */
	function sc_google_recaptcha_script() {
		wp_enqueue_script( 'sc_google_recaptcha_script', 'https://www.google.com/recaptcha/api.js?render='. get_option( 'sc_recaptcha_site_key', true ) .'', array(), date('Y-m-d') );
	}
	add_action( 'wp_enqueue_scripts', 'sc_google_recaptcha_script' );
}