<?php
/**
 * Plugin Name: SureCart
 * Plugin URI: https://surecart.com/
 * Description: A simple yet powerful headless e-commerce platform designed to grow your business with effortlessly selling online.
 * Version: 1.5.2
 * Requires at least: 5.9
 * Requires PHP: 7.4
 * Author: SureCart
 * Author URI: https://surecart.com
 * License: GPL-2.0-only
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: surecart
 * Domain Path: /languages
 *
 * YOU SHOULD NORMALLY NOT NEED TO ADD ANYTHING HERE - any custom functionality unrelated
 * to bootstrapping the theme should go into a service provider or a separate helper file
 * (refer to the directory structure in README.md).
 *
 * @package SureCart
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SURECART_PLUGIN_FILE', __FILE__ );

define( 'SURECART_LANGUAGE_DIR', __DIR__ . DIRECTORY_SEPARATOR . 'languages' );

// define host url.
if ( ! defined( 'SURECART_APP_URL' ) ) {
	define( 'SURECART_APP_URL', 'https://app.surecart.com' );
}
if ( ! defined( 'SURECART_API_URL' ) ) {
	define( 'SURECART_API_URL', 'https://api.surecart.com' );
}

// Load composer dependencies.
if ( file_exists( __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php' ) ) {
	require_once __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
}

// Load helpers.
require_once __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'SureCart.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'helpers.php';

// Bootstrap plugin after all dependencies and helpers are loaded.
\SureCart::make()->bootstrap( require __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'config.php' );

// Register hooks.
require_once __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'hooks.php';


add_action( 'plugins_loaded', 'sc_load_textdomain' );

/**
 * Load Plugin Text Domain.
 * This will load the translation textdomain depending on the file priorities.
 *      1. Global Languages /wp-content/languages/surecart/ folder
 *      2. Local directory /wp-content/plugins/surecart/languages/ folder
 *
 * @since 1.0.0
 * @return void
 */
function sc_load_textdomain() {
	// Default languages directory.
	$lang_dir = __DIR__ . DIRECTORY_SEPARATOR . 'languages' . DIRECTORY_SEPARATOR;

	/**
	 * Filters the languages directory path to use for plugin.
	 *
	 * @param string $lang_dir The languages directory path.
	 */
	$lang_dir = apply_filters( 'surecart_languages_directory', $lang_dir );

	$get_locale = get_user_locale();

	/**
	 * Language Locale for plugin
	 *
	 * @var string $get_locale The locale to use.
	 * Uses get_user_locale()` in WordPress 4.7 or greater,
	 * otherwise uses `get_locale()`.
	 */
	$locale = apply_filters( 'plugin_locale', $get_locale, 'surecart' );
	$mofile = sprintf( '%1$s-%2$s.mo', 'surecart', $locale );

	// Setup paths to current locale file.
	$mofile_global = WP_LANG_DIR . '/plugins/' . $mofile;
	$mofile_local  = $lang_dir . $mofile;

	if ( file_exists( $mofile_global ) ) {
		// Look in global /wp-content/languages/surecart/ folder.
		load_textdomain( 'surecart', $mofile_global );
	} elseif ( file_exists( $mofile_local ) ) {
		// Look in local /wp-content/plugins/surecart/languages/ folder.
		load_textdomain( 'surecart', $mofile_local );
	} else {
		// Load the default language files.
		load_plugin_textdomain( 'surecart', false, $lang_dir );
	}
}
