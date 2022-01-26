<?php
/**
 * @package   CheckoutEngineAppCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkoutengine.com
 */

/**
 * Absolute path to app core's directory
 */
if ( ! defined( 'CHECKOUT_ENGINE_APP_CORE_DIR' ) ) {
	define( 'CHECKOUT_ENGINE_APP_CORE_DIR', __DIR__ );
}

/**
 * Absolute path to app core's src directory
 */
if ( ! defined( 'CHECKOUT_ENGINE_APP_CORE_SRC_DIR' ) ) {
	define( 'CHECKOUT_ENGINE_APP_CORE_SRC_DIR', CHECKOUT_ENGINE_APP_CORE_DIR . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR );
}
