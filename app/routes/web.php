<?php
/**
 * Web Routes.
 *
 * @link https://docs.wpemerge.com/#/framework/routing/methods
 *
 * @package SureCart
 */

use SureCart\Middleware\CheckoutRedirectMiddleware;
use SureCart\Middleware\CustomerDashboardRedirectMiddleware;
use SureCart\Middleware\LoginLinkMiddleware;
use SureCart\Middleware\OrderRedirectMiddleware;
use SureCart\Middleware\PathRedirectMiddleware;
use SureCart\Middleware\PaymentFailureRedirectMiddleware;
use SureCart\Middleware\PurchaseRedirectMiddleware;
use SureCart\Middleware\SubscriptionRedirectMiddleware;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
|--------------------------------------------------------------------------
| Product Page
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'query_var', 'sc_product_page_id' )
->handle( 'ProductPageController@show' );

/*
|--------------------------------------------------------------------------
| Buy Page
|--------------------------------------------------------------------------
*/
\SureCart::route()
	->get()
	->where( 'query_var', 'sc_checkout_product_id' )
	->handle( 'BuyPageController@show' );

/*
|--------------------------------------------------------------------------
| Collection Page
|--------------------------------------------------------------------------
*/
\SureCart::route()
	->get()
	->where( 'query_var', 'sc_collection_page_id' )
	->handle( 'CollectionPageController@show' );

/*
|--------------------------------------------------------------------------
| Receive Webhooks
|--------------------------------------------------------------------------
*/
\SureCart::route()
	->post()
	->url( '/surecart/webhooks' )
	->name( 'webhooks' )
	->middleware( 'webhooks' )
	->handle( 'WebhookController@receive' );

/*
|--------------------------------------------------------------------------
| Redirect
|--------------------------------------------------------------------------
*/
\SureCart::route()
->get()
->where( 'query_var', 'sc_redirect' )
// handle login.
->middleware( LoginLinkMiddleware::class )
// redirect in this order.
->middleware( PathRedirectMiddleware::class )
->middleware( OrderRedirectMiddleware::class )
->middleware( PurchaseRedirectMiddleware::class )
->middleware( CheckoutRedirectMiddleware::class )
->middleware( PaymentFailureRedirectMiddleware::class )
->middleware( SubscriptionRedirectMiddleware::class )
// customer dashboard redirect is the fallback if there is a customer_id present.
->middleware( CustomerDashboardRedirectMiddleware::class )
->handle( 'DashboardController@show' );
