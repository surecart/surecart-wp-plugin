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

/*
|--------------------------------------------------------------------------
| Onboarding
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->get()
->where( 'admin', 'ce-getting-started' )
->middleware( 'user.can:edit_pk_products' )
->handle( 'Onboarding@show' );

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()->get()->where( 'admin', 'ce-dashboard' )->name( 'dashboard' )->handle( 'Dashboard@show' );


/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-orders' )
->middleware( 'user.can:edit_pk_orders' ) // TODO: change to manage coupons.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Orders\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'orders.index' )->handle( 'OrdersViewController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'orders.edit' )->handle( 'OrdersViewController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-products' )
->middleware( 'user.can:edit_pk_products' ) // TODO: change to manage products.
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
->middleware( 'user.can:edit_pk_coupons' ) // TODO: change to manage coupons.
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
->middleware( 'user.can:manage_pk_account_settings' )
->handle( 'Settings@show' );
