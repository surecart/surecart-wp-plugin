<?php
/**
 * WordPress Admin Routes.
 * WARNING: Do not use \CheckoutEngine::route()->all() here, otherwise you will override
 * ALL custom admin pages which you most likely do not want to do.
 *
 * @link https://docs.wpemerge.com/#/framework/routing/methods
 *
 * @package CheckoutEngine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Using our ExampleController to handle a custom admin page registered using add_menu_page(), for example.
// phpcs:ignore
\CheckoutEngine::route()->get()->where( 'admin', 'ce-settings' )->handle( 'Dashboard@show' );
\CheckoutEngine::route()->get()->where( 'admin', 'ce-products' )->handle( 'Products@list' );
