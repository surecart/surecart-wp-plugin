<?php
/**
 * Plugin Name: SureCart
 * Plugin URI: https://surecart.com/
 * Description:
 * Version: 0.0.2
 * Requires at least: 5.9-RC3
 * Requires PHP: 5.5.9
 * Author: Andre Gagnon
 * Author URI: https://andregagnon.me
 * License: GPL-2.0-only
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: checkout_engine
 * Domain Path: /languages
 *
 * YOU SHOULD NORMALLY NOT NEED TO ADD ANYTHING HERE - any custom functionality unrelated
 * to bootstrapping the theme should go into a service provider or a separate helper file
 * (refer to the directory structure in README.md).
 *
 * @package CheckoutEngine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CHECKOUT_ENGINE_PLUGIN_FILE', __FILE__ );

// define host url.
if ( ! defined( 'CHECKOUT_ENGINE_APP_URL' ) ) {
	define( 'CHECKOUT_ENGINE_APP_URL', 'https://staging.surecart.com' );
}

// Load composer dependencies.
if ( file_exists( __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php' ) ) {
	require_once __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
}

// Load helpers.
require_once __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'CheckoutEngine.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'helpers.php';

// Bootstrap plugin after all dependencies and helpers are loaded.
\CheckoutEngine::make()->bootstrap( require __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'config.php' );

// Register hooks.
require_once __DIR__ . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'hooks.php';



add_action(
	'checkout_engine/purchase_revoked',
	function( $purchase_id ) {
		$purchase   = new \CheckoutEngine\Models\Purchase( $purchase_id );
		$product_id = (string) $purchase->product;
		if ( 'd26734b3-0a0d-45c1-8044-16fbd11bca2f' === $product_id ) {
			// remove credit from user.
		}
	}
);
