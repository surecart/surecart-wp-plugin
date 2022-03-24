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
->handle( 'Onboarding@show' );

\SureCart::route()
->get()
->where( 'admin', 'sc-complete-signup' )
->middleware( 'user.can:manage_options' )
->group(
	function() {
		\SureCart::route()->get()->name( 'onboarding.complete' )->handle( 'Onboarding@complete' );
		\SureCart::route()->post()->middleware( 'nonce:update_plugin_settings' )->name( 'onboarding.save' )->handle( 'Onboarding@save' );
	}
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
\SureCart::route()->get()->where( 'admin', 'sc-dashboard' )->name( 'dashboard' )->handle( 'Dashboard@show' );


/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-orders' )
->middleware( 'user.can:edit_sc_orders' ) // TODO: change to manage coupons.
->setNamespace( '\\SureCart\\Controllers\\Admin\\Orders\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'orders.index' )->handle( 'OrdersViewController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'orders.edit' )->handle( 'OrdersViewController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'archive', 'action' )->name( 'orders.archive' )->handle( 'OrdersViewController@archive' );
	}
);

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-invoices' )
->middleware( 'user.can:edit_sc_invoices' ) // TODO: change to manage coupons.
->setNamespace( '\\SureCart\\Controllers\\Admin\\Invoices\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'invoices.index' )->handle( 'InvoicesViewController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'invoices.edit' )->handle( 'InvoicesViewController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'archive', 'action' )->name( 'invoices.archive' )->handle( 'InvoicesViewController@archive' );
	}
);

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-products' )
->middleware( 'user.can:edit_sc_products' ) // TODO: change to manage products.
->setNamespace( '\\SureCart\\Controllers\\Admin\\Products\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'products.index' )->handle( 'ProductsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'product.edit' )->handle( 'ProductsController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'toggle_archive', 'action' )->name( 'product.archive' )->middleware( 'archive_model:product' )->handle( 'ProductsController@toggleArchive' );
	}
);

/*
|--------------------------------------------------------------------------
| Coupons
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-coupons' )
->middleware( 'user.can:edit_sc_coupons' ) // TODO: change to manage coupons.
->setNamespace( '\\SureCart\\Controllers\\Admin\\Coupons\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'coupons.index' )->handle( 'CouponsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'coupons.edit' )->handle( 'CouponsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Customers
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-customers' )
->middleware( 'user.can:edit_sc_customers' ) // TODO: change to manage products.
->setNamespace( '\\SureCart\\Controllers\\Admin\\Customers\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'customer.index' )->handle( 'CustomersController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'customer.edit' )->handle( 'CustomersController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Abandoned Orders
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-abandoned-orders' )
->middleware( 'user.can:edit_sc_orders' ) // TODO: change to manage coupons.
->setNamespace( '\\SureCart\\Controllers\\Admin\\Abandoned\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'abandoned.index' )->handle( 'AbandonedOrderViewController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'abandoned.edit' )->handle( 'AbandonedOrderViewController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Subscriptions
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-subscriptions' )
->middleware( 'user.can:edit_sc_subscriptions' ) // TODO: change to manage coupons.
->setNamespace( '\\SureCart\\Controllers\\Admin\\Subscriptions\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'subscriptions.index' )->handle( 'SubscriptionsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'show', 'action' )->name( 'subscriptions.show' )->handle( 'SubscriptionsController@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'subscriptions.edit' )->handle( 'SubscriptionsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Upgrade Paths
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-product-groups' )
->middleware( 'user.can:edit_sc_products' ) // TODO: change to manage coupons.
->setNamespace( '\\SureCart\\Controllers\\Admin\\ProductGroups\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->name( 'product_groups.index' )->handle( 'ProductGroupsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'show', 'action' )->name( 'product_groups.show' )->handle( 'ProductGroupsController@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->name( 'product_groups.edit' )->handle( 'ProductGroupsController@show' );

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
->group(
	function() {
		\SureCart::route()->get()->name( 'plugin.show' )->handle( 'PluginSettings@show' );
		\SureCart::route()->post()->middleware( 'nonce:update_plugin_settings' )->name( 'plugin.save' )->handle( 'PluginSettings@save' );
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
