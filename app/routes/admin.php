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

use SureCart\Middleware\AccountClaimMiddleware;
use SureCart\Models\ApiToken;

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
->middleware( 'assets.brand_colors' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Onboarding\\' )
->handle( 'OnboardingController@show' );

/*
|--------------------------------------------------------------------------
| Claim Account
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'admin', 'sc-claim-account' )
->name( 'account.claim' )
->middleware( AccountClaimMiddleware::class )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Onboarding\\' )
->handle( 'OnboardingController@show' );

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'admin', 'sc-dashboard' )
->middleware( 'user.can:manage_sc_shop_settings' )
->middleware( 'assets.components' )
->name( 'dashboard.show' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Dashboard\\' )
->handle( 'DashboardController@index' );

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
->middleware( 'assets.brand_colors' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Onboarding\\' )
->group(
	function() {
		\SureCart::route()->get()->handle( 'OnboardingController@complete' );
		\SureCart::route()->post()->middleware( 'nonce:update_plugin_settings' )->handle( 'OnboardingController@save' );
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
| Checkouts
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-checkouts' )
->middleware( 'user.can:edit_sc_orders' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Checkouts\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'CheckoutsController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'CheckoutsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Invoices
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
| Licenses
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-licenses' )
->middleware( 'user.can:edit_sc_products' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Licenses\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'LicensesController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'LicensesController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Abandoned Checkouts
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-abandoned-checkouts' )
->middleware( 'user.can:edit_sc_orders' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Abandoned\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'AbandonedCheckoutViewController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'AbandonedCheckoutViewController@edit' );
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
| Cancellation Insights
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-cancellation-insights' )
->middleware( 'user.can:edit_sc_subscriptions' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\CancellationInsights\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'CancellationInsightsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'show', 'action' )->handle( 'CancellationInsightsController@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'CancellationInsightsController@edit' );
	}
);


\SureCart::route()
->where( 'admin', 'cart' )
->middleware( 'user.can:manage_options' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Cart\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'CartController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'show', 'action' )->handle( 'CartController@edit' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'CartController@edit' );
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
| Product Collections
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-product-collections' )
->middleware( 'user.can:edit_sc_products' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\ProductCollections\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'ProductCollectionsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'ProductCollectionsController@edit' );
	}
);

/*
|--------------------------------------------------------------------------
| Upgrade Paths
|--------------------------------------------------------------------------
*/
\SureCart::route()
->where( 'admin', 'sc-bumps' )
->middleware( 'user.can:edit_sc_products' )
->middleware( 'assets.components' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Bumps\\' )
->group(
	function() {
		\SureCart::route()->get()->where( 'sc_url_var', false, 'action' )->handle( 'BumpsController@index' );
		\SureCart::route()->get()->where( 'sc_url_var', 'edit', 'action' )->handle( 'BumpsController@edit' );
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
->middleware( 'assets.components' )
->middleware( 'assets.brand_colors' )
->setNamespace( '\\SureCart\\Controllers\\Admin\\Settings\\' )
->group(
	function() {
		// limit menu routes if no API token.
		if ( ! ApiToken::get() ) {
			// without the var.
			\SureCart::route()->get()->where( 'sc_url_var', false, 'tab' )->handle( 'ConnectionSettings@show' );
			\SureCart::route()->post()->where( 'sc_url_var', false, 'tab' )->middleware( 'nonce:update_plugin_settings' )->handle( 'ConnectionSettings@save' );

			// with the var.
			\SureCart::route()->get()->where( 'sc_url_var', 'connection', 'tab' )->handle( 'ConnectionSettings@show' );
			\SureCart::route()->post()->where( 'sc_url_var', 'connection', 'tab' )->middleware( 'nonce:update_plugin_settings' )->handle( 'ConnectionSettings@save' );

			// Advanced.
			\SureCart::route()->get()->where( 'sc_url_var', 'advanced', 'tab' )->name( 'settings.advanced' )->handle( 'AdvancedSettings@show' );
			\SureCart::route()->post()->where( 'sc_url_var', 'advanced', 'tab' )->middleware( 'nonce:update_plugin_settings' )->handle( 'AdvancedSettings@save' );

			// Cache.
			\SureCart::route()->post()->where( 'sc_url_var', 'clear', 'cache' )->middleware( 'nonce:update_plugin_settings' )->handle( 'CacheSettings@clear' );
			return;
		}

		// Settings.
		\SureCart::route()->get()->where( 'sc_url_var', false, 'tab' )->name( 'settings.account' )->handle( 'AccountSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'brand', 'tab' )->name( 'settings.brand' )->handle( 'BrandSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'order', 'tab' )->name( 'settings.order' )->handle( 'OrderSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'abandoned_checkout', 'tab' )->name( 'settings.abandoned_checkout' )->handle( 'AbandonedCheckoutSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'subscription_preservation', 'tab' )->name( 'settings.subscription_preservation' )->handle( 'SubscriptionPreservationSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'customer_notification_protocol', 'tab' )->name( 'settings.customer' )->handle( 'CustomerSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'subscription_protocol', 'tab' )->name( 'settings.subscription' )->handle( 'SubscriptionSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'tax_protocol', 'tab' )->where( 'sc_url_var', 'region', 'type' )->name( 'settings.tax.region' )->handle( 'TaxRegionSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'tax_protocol', 'tab' )->name( 'settings.tax' )->handle( 'TaxSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'upgrade', 'tab' )->name( 'settings.upgrade' )->handle( 'UpgradeSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'shipping_protocol', 'tab' )->where( 'sc_url_var', 'shipping_profile', 'type' )->name( 'settings.shipping.profile' )->handle( 'ShippingProfileSettings@show' );
		\SureCart::route()->get()->where( 'sc_url_var', 'shipping_protocol', 'tab' )->name( 'settings.shipping' )->handle( 'ShippingSettings@show' );

		// Connection.
		\SureCart::route()->get()->where( 'sc_url_var', 'connection', 'tab' )->name( 'settings.connection' )->handle( 'ConnectionSettings@show' );
		\SureCart::route()->post()->where( 'sc_url_var', 'connection', 'tab' )->middleware( 'nonce:update_plugin_settings' )->name( 'settings.connection.save' )->handle( 'ConnectionSettings@save' );

		// Advanced.
		\SureCart::route()->get()->where( 'sc_url_var', 'advanced', 'tab' )->name( 'settings.advanced' )->handle( 'AdvancedSettings@show' );
		\SureCart::route()->post()->where( 'sc_url_var', 'advanced', 'tab' )->middleware( 'nonce:update_plugin_settings' )->name( 'settings.advanced.save' )->handle( 'AdvancedSettings@save' );

		// Processors.
		\SureCart::route()->get()->where( 'sc_url_var', 'processors', 'tab' )->name( 'settings.processors' )->handle( 'ProcessorsSettings@show' );

		// Export.
		\SureCart::route()->get()->where( 'sc_url_var', 'export', 'tab' )->name( 'settings.export' )->handle( 'ExportSettings@show' );

		// Cache.
		\SureCart::route()->post()->where( 'sc_url_var', 'clear', 'cache' )->middleware( 'nonce:update_plugin_settings' )->handle( 'CacheSettings@clear' );
	}
);

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
	->where( 'sc_url_var', 'create_webhook', 'action' )
	->name( 'webhook.create' )
	->middleware( 'nonce:create_webhook' )
	->middleware( 'user.can:edit_sc_webhooks' )
	->handle( '\\SureCart\\Controllers\\Web\\WebhookController@create' );
\SureCart::route()
	->get()
	->where( 'sc_url_var', 'update_webhook', 'action' )
	->name( 'webhook.update' )
	->middleware( 'nonce:update_webhook' )
	->middleware( 'user.can:edit_sc_webhooks' )
	->handle( '\\SureCart\\Controllers\\Web\\WebhookController@update' );
\SureCart::route()
	->get()
	->where( 'sc_url_var', 'resync_webhook', 'action' )
	->name( 'webhook.resync' )
	->middleware( 'nonce:resync_webhook' )
	->middleware( 'user.can:edit_sc_webhooks' )
	->handle( '\\SureCart\\Controllers\\Web\\WebhookController@resync' );
