<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com/
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
	define( 'CHECKOUT_ENGINE_CONFIG_KEY', 'surecart.config' );
}

if ( ! defined( 'CHECKOUT_ENGINE_APPLICATION_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_APPLICATION_KEY', 'surecart.application.application' );
}

if ( ! defined( 'CHECKOUT_ENGINE_APPLICATION_GENERIC_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_APPLICATION_GENERIC_FACTORY_KEY', 'surecart.application.generic_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_APPLICATION_CLOSURE_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_APPLICATION_CLOSURE_FACTORY_KEY', 'surecart.application.closure_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_HELPERS_HANDLER_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_HELPERS_HANDLER_FACTORY_KEY', 'surecart.handlers.helper_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_WORDPRESS_HTTP_KERNEL_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_WORDPRESS_HTTP_KERNEL_KEY', 'surecart.kernels.wordpress_http_kernel' );
}

if ( ! defined( 'CHECKOUT_ENGINE_SESSION_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_SESSION_KEY', 'surecart.session' );
}

if ( ! defined( 'CHECKOUT_ENGINE_REQUEST_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_REQUEST_KEY', 'surecart.request' );
}

if ( ! defined( 'CHECKOUT_ENGINE_RESPONSE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_RESPONSE_KEY', 'surecart.response' );
}

if ( ! defined( 'CHECKOUT_ENGINE_EXCEPTIONS_ERROR_HANDLER_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_EXCEPTIONS_ERROR_HANDLER_KEY', 'surecart.exceptions.error_handler' );
}

if ( ! defined( 'CHECKOUT_ENGINE_EXCEPTIONS_CONFIGURATION_ERROR_HANDLER_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_EXCEPTIONS_CONFIGURATION_ERROR_HANDLER_KEY', 'surecart.exceptions.configuration_error_handler' );
}

if ( ! defined( 'CHECKOUT_ENGINE_RESPONSE_SERVICE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_RESPONSE_SERVICE_KEY', 'surecart.responses.response_service' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_ROUTER_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_ROUTER_KEY', 'surecart.routing.router' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_ROUTE_BLUEPRINT_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_ROUTE_BLUEPRINT_KEY', 'surecart.routing.route_registrar' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_CONDITIONS_CONDITION_FACTORY_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_CONDITIONS_CONDITION_FACTORY_KEY', 'surecart.routing.conditions.condition_factory' );
}

if ( ! defined( 'CHECKOUT_ENGINE_ROUTING_CONDITION_TYPES_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_ROUTING_CONDITION_TYPES_KEY', 'surecart.routing.conditions.condition_types' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_SERVICE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_SERVICE_KEY', 'surecart.view.view_service' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_COMPOSE_ACTION_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_COMPOSE_ACTION_KEY', 'surecart.view.view_compose_action' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_ENGINE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_ENGINE_KEY', 'surecart.view.view_engine' );
}

if ( ! defined( 'CHECKOUT_ENGINE_VIEW_PHP_VIEW_ENGINE_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_VIEW_PHP_VIEW_ENGINE_KEY', 'surecart.view.php_view_engine' );
}

if ( ! defined( 'CHECKOUT_ENGINE_SERVICE_PROVIDERS_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_SERVICE_PROVIDERS_KEY', 'surecart.service_providers' );
}

if ( ! defined( 'CHECKOUT_ENGINE_FLASH_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_FLASH_KEY', 'surecart.flash.flash' );
}

if ( ! defined( 'CHECKOUT_ENGINE_OLD_INPUT_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_OLD_INPUT_KEY', 'surecart.old_input.old_input' );
}

if ( ! defined( 'CHECKOUT_ENGINE_CSRF_KEY' ) ) {
	define( 'CHECKOUT_ENGINE_CSRF_KEY', 'surecart.csrf.csrf' );
}
