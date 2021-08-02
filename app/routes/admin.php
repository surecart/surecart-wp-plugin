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

\CheckoutEngine::route()->get()->where( 'admin', 'ce-dashboard' )->name( 'dashboard' )->handle( 'Dashboard@show' );
\CheckoutEngine::route()->get()->where( 'admin', 'ce-products' )->handle( 'Products@page' );
\CheckoutEngine::route()->get()->where( 'admin', 'ce-orders' )->handle( 'Orders@list' );
// \CheckoutEngine::route()->get()->where( 'admin', 'ce-coupons' )->handle( 'Coupons@index' );

/*
|--------------------------------------------------------------------------
| Coupons
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-coupons' )
->middleware( 'user.can:manage_options' ) // manage coupons.
->group(
	function() {
		/*
		|--------------------------------------------------------------------------
		| General
		|--------------------------------------------------------------------------
		*/
		\CheckoutEngine::route()->where(
			function() {
                return empty( $_GET['action'] ); // phpcs:ignore
			}
		)->group(
			function() {
				\CheckoutEngine::route()->get()->handle( 'Coupons@index' );
			}
		);

		/*
		|--------------------------------------------------------------------------
		| Edit
		|--------------------------------------------------------------------------
		*/
		\CheckoutEngine::route()->where(
			function() {
                return ! empty( $_GET['action'] ) && 'edit' ===  $_GET['action']; // phpcs:ignore
			}
		)->group(
			function() {
				\CheckoutEngine::route()->get()->handle( 'Coupons@edit' );
			}
		);
	}
);

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/

\CheckoutEngine::route()
->where( 'admin', 'ce-settings' )
->middleware( 'user.can:manage_options' )
->group(
	function() {
		/*
		|--------------------------------------------------------------------------
		| General
		|--------------------------------------------------------------------------
		*/
		\CheckoutEngine::route()->where(
			function() {
                return empty( $_GET['tab'] ); // phpcs:ignore
			}
		)->group(
			function() {
				\CheckoutEngine::route()->get()->handle( 'Settings@show' );
			}
		);

		/*
		|--------------------------------------------------------------------------
		| Account
		|--------------------------------------------------------------------------
		*/
		\CheckoutEngine::route()->where(
			function() {
                return ! empty( $_GET['tab'] ) && 'account' ===  $_GET['tab']; // phpcs:ignore
			}
		)->group(
			function() {
				\CheckoutEngine::route()->get()->handle( 'Account@show' );
				\CheckoutEngine::route()->post()->handle( 'Account@update' );
			}
		);
	}
);
