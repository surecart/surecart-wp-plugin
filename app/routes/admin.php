<?php
/**
 * WordPress Admin Routes.
 * WARNING: Do not use \SureCart::route()->all() here, otherwise you will override
 * ALL custom admin pages which you most likely do not want to do.
 *
 * @link https://docs.wpemerge.com/#/framework/routing/methods
 *
 * @package SureCart
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
|--------------------------------------------------------------------------
| Onboarding
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'admin', 'sc-getting-started' )
->name( 'onboarding.show' )
->middleware( 'user.can:manage_options' )
->middleware( 'assets.components' )
->handle( 'Onboarding@show' );

/*
|--------------------------------------------------------------------------
| Complete Signup
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'admin', 'sc-complete-signup' )
->middleware( 'user.can:manage_options' )
->middleware( 'assets.components' )
->group(
	function() {
		\SureCart::route()->get()->handle( 'Onboarding@complete' );
		\SureCart::route()->post()->middleware( 'nonce:update_plugin_settings' )->handle( 'Onboarding@save' );
	}
);


/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-orders' )
->middleware( 'user.can:edit_sc_orders' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Orders\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'OrdersViewController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'OrdersViewController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'archive', 'action' )->handle( 'OrdersViewController@archive' );
	}
);

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-invoices' )
->middleware( 'user.can:edit_sc_invoices' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Invoices\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'InvoicesViewController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'InvoicesViewController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'archive', 'action' )->handle( 'InvoicesViewController@archive' );
	}
);

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-products' )
->middleware( 'user.can:edit_sc_products' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Products\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'ProductsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'ProductsController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'toggle_archive', 'action' )->middleware( 'archive_model:product' )->handle( 'ProductsController@toggleArchive' );
	}
);

/*
|--------------------------------------------------------------------------
| Coupons
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-coupons' )
->middleware( 'user.can:edit_sc_coupons' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Coupons\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'CouponsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'CouponsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Customers
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-customers' )
->middleware( 'user.can:edit_sc_customers' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Customers\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'CustomersController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'CustomersController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Abandoned Orders
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-abandoned-orders' )
->middleware( 'user.can:edit_sc_orders' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Abandoned\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'AbandonedOrderViewController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'AbandonedOrderViewController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Subscriptions
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-subscriptions' )
->middleware( 'user.can:edit_sc_subscriptions' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Subscriptions\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'SubscriptionsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'show', 'action' )->handle( 'SubscriptionsController@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'SubscriptionsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Upgrade Paths
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-product-groups' )
->middleware( 'user.can:edit_sc_products' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\ProductGroups\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'ProductGroupsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'show', 'action' )->handle( 'ProductGroupsController@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'ProductGroupsController@show' );
	}
);

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'admin', 'sc-settings' )
->middleware( 'user.can:manage_sc_account_settings' )
->handle( 'Settings@show' );

/*
|--------------------------------------------------------------------------
| Connection
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'admin', 'sc-plugin' )
->middleware( 'user.can:manage_options' )
->middleware( 'assets.components' )
->group(
	function() {
		\SureCart::route()->get()->name( 'plugin.show' )->handle( 'PluginSettings@show' );
		\SureCart::route()->post()->middleware( 'nonce:update_plugin_settings' )->handle( 'PluginSettings@save' );
	}
);

/*
|--------------------------------------------------------------------------
| Webhooks
|--------------------------------------------------------------------------
*/
\SureCart::route()
	->get()
	->where( 'sc_url_var', 'remove_webhook', 'action' )
	->name( 'webhook.remove' )
	->middleware( 'nonce:remove_webhook' )
	->middleware( 'user.can:edit_sc_webhooks' )
	->handle( '\\SureCart\\Controllers\\Web\\WebhookController@remove' );

\SureCart::route()
	->get()
	->where( 'sc_url_var', 'ignore_webhook', 'action' )
	->name( 'webhook.ignore' )
	->middleware( 'nonce:ignore_webhook' )
	->middleware( 'user.can:edit_sc_webhooks' )
	->handle( '\\SureCart\\Controllers\\Web\\WebhookController@ignore' );
