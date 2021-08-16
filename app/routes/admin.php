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

\CheckoutEngine::route()->get()->where( 'admin', 'ce-dashboard' )->name( 'dashboard' )->handle( 'Dashboard@show' );
// \CheckoutEngine::route()->get()->where( 'admin', 'ce-products' )->handle( 'Products@page' );
\CheckoutEngine::route()->get()->where( 'admin', 'ce-orders' )->handle( 'Orders@list' );

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-products' )
->middleware( 'user.can:manage_options' ) // TODO: change to manage products.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Products\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'products.index' )->handle( 'ProductsViewController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'product.edit' )->handle( 'ProductsViewController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Coupons
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-coupons' )
->middleware( 'user.can:manage_options' ) // TODO: change to manage coupons.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Coupons\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'coupons.index' )->handle( 'CouponsViewController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'coupons.edit' )->handle( 'CouponsViewController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->get()
->where( 'admin', 'ce-settings' )
->middleware( 'user.can:manage_options' )
->handle( 'Settings@show' );
