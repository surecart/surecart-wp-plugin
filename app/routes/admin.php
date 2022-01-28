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

use CheckoutEngine\Middleware\ArchiveModelMiddleware;

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
->middleware( 'user.can:edit_ce_products' )
->handle( 'Onboarding@show' );

\CheckoutEngine::route()
->get()
->where( 'admin', 'ce-onboarding' )
->middleware( 'user.can:edit_ce_products' )
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
->middleware( 'user.can:edit_ce_orders' ) // TODO: change to manage coupons.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Orders\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'orders.index' )->handle( 'OrdersViewController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'orders.edit' )->handle( 'OrdersViewController@edit' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'archive', 'action' )->name( 'orders.archive' )->handle( 'OrdersViewController@archive' );
	}
);

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-products' )
->middleware( 'user.can:edit_ce_products' ) // TODO: change to manage products.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Products\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'products.index' )->handle( 'ProductsController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'product.edit' )->handle( 'ProductsController@edit' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'toggle_archive', 'action' )->name( 'product.archive' )->middleware( 'archive_model:product' )->handle( 'ProductsController@toggleArchive' );
	}
);

/*
|--------------------------------------------------------------------------
| Coupons
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-coupons' )
->middleware( 'user.can:edit_ce_coupons' ) // TODO: change to manage coupons.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Coupons\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'coupons.index' )->handle( 'CouponsController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'coupons.edit' )->handle( 'CouponsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Customers
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-customers' )
->middleware( 'user.can:edit_ce_customers' ) // TODO: change to manage products.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Customers\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'customer.index' )->handle( 'CustomersController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'customer.edit' )->handle( 'CustomersController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Abandoned Orders
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-abandoned-orders' )
->middleware( 'user.can:edit_ce_orders' ) // TODO: change to manage coupons.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Abandoned\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'abandoned.index' )->handle( 'AbandonedOrderViewController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'abandoned.edit' )->handle( 'AbandonedOrderViewController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-subscriptions' )
->middleware( 'user.can:edit_ce_subscriptions' ) // TODO: change to manage coupons.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\Subscriptions\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'action' )->name( 'subscriptions.index' )->handle( 'SubscriptionsController@index' );
		\CheckoutEngine::route()->get()->where( 'ce_url_var', 'edit', 'action' )->name( 'subscriptions.edit' )->handle( 'SubscriptionsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Upgrade Paths
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
->where( 'admin', 'ce-upgrade-paths' )
->middleware( 'user.can:edit_ce_subscriptions' ) // TODO: change to manage coupons.
->setNamespace( '\\CheckoutEngine\\Controllers\\Admin\\UpgradePaths\\' )
->group(
	function() {
		\CheckoutEngine::route()->get()->name( 'upgrade-paths.edit' )->handle( 'UpgradePathsController@edit' );
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
->middleware( 'user.can:manage_ce_account_settings' )
->handle( 'Settings@show' );

/*
|--------------------------------------------------------------------------
| Webhooks
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
	->get()
	->where( 'ce_url_var', 'remove_webhook', 'action' )
	->name( 'webhook.remove' )
	->middleware( 'nonce:remove_webhook' )
	->middleware( 'user.can:edit_ce_webhooks' )
	->handle( '\\CheckoutEngine\\Controllers\\Web\\WebhookController@remove' );
