<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

/**
 * Absolute path to application's directory.
 */
if ( ! defined( 'CHECKOUT_ENGINE_DIR' ) ) {
	define( 'CHECKOUT_ENGINE_DIR', __DIR__ );
}

/**
 * Service container keys.
 */
if ( ! defined( 'CHECKOUT_ENGINE_CONFIG_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_CONFIG_KEY', 'checkout_engine.config' );
}

if ( ! defined( 'CHECKOUT_ENGINE_APPLICATION_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_APPLICATION_KEY', 'checkout_engine.application.application' );
}

if ( ! defined( 'CHECKOUT_ENGINE_APPLICATION_GENERIC_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_APPLICATION_GENERIC_FACTORY_KEY', 'checkout_engine.application.generic_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_APPLICATION_CLOSURE_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_APPLICATION_CLOSURE_FACTORY_KEY', 'checkout_engine.application.closure_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_HELPERS_HANDLER_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_HELPERS_HANDLER_FACTORY_KEY', 'checkout_engine.handlers.helper_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_WORDPRESS_HTTP_KERNEL_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_WORDPRESS_HTTP_KERNEL_KEY', 'checkout_engine.kernels.wordpress_http_kernel' );
}

if ( ! defined( 'CHECKOUT_ENGINE_SESSION_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_SESSION_KEY', 'checkout_engine.session' );
}

if ( ! defined( 'CHECKOUT_ENGINE_REQUEST_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_REQUEST_KEY', 'checkout_engine.request' );
}

if ( ! defined( 'CHECKOUT_ENGINE_RESPONSE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_RESPONSE_KEY', 'checkout_engine.response' );
}

if ( ! defined( 'CHECKOUT_ENGINE_EXCEPTIONS_ERROR_HANDLER_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_EXCEPTIONS_ERROR_HANDLER_KEY', 'checkout_engine.exceptions.error_handler' );
}

if ( ! defined( 'CHECKOUT_ENGINE_EXCEPTIONS_CONFIGURATION_ERROR_HANDLER_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_EXCEPTIONS_CONFIGURATION_ERROR_HANDLER_KEY', 'checkout_engine.exceptions.configuration_error_handler' );
}

if ( ! defined( 'CHECKOUT_ENGINE_RESPONSE_SERVICE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_RESPONSE_SERVICE_KEY', 'checkout_engine.responses.response_service' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_ROUTER_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_ROUTER_KEY', 'checkout_engine.routing.router' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_ROUTE_BLUEPRINT_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_ROUTE_BLUEPRINT_KEY', 'checkout_engine.routing.route_registrar' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_CONDITIONS_CONDITION_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_CONDITIONS_CONDITION_FACTORY_KEY', 'checkout_engine.routing.conditions.condition_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_CONDITION_TYPES_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_CONDITION_TYPES_KEY', 'checkout_engine.routing.conditions.condition_types' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_SERVICE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_SERVICE_KEY', 'checkout_engine.view.view_service' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_COMPOSE_ACTION_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_COMPOSE_ACTION_KEY', 'checkout_engine.view.view_compose_action' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_ENGINE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_ENGINE_KEY', 'checkout_engine.view.view_engine' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_PHP_VIEW_ENGINE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_PHP_VIEW_ENGINE_KEY', 'checkout_engine.view.php_view_engine' );
}

if ( ! defined( 'CHECKOUT_ENGINE_SERVICE_PROVIDERS_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_SERVICE_PROVIDERS_KEY', 'checkout_engine.service_providers' );
}

if ( ! defined( 'CHECKOUT_ENGINE_FLASH_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_FLASH_KEY', 'checkout_engine.flash.flash' );
}

if ( ! defined( 'CHECKOUT_ENGINE_OLD_INPUT_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_OLD_INPUT_KEY', 'checkout_engine.old_input.old_input' );
}

if ( ! defined( 'CHECKOUT_ENGINE_CSRF_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_CSRF_KEY', 'checkout_engine.csrf.csrf' );
}
