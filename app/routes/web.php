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
| Buy Page
|--------------------------------------------------------------------------
*/
\SureCart::permalink()
	->params( [ 'sc_checkout_product_id' ] )
	->url( untrailingslashit( \SureCart::settings()->permalinks()->getBase( 'buy_page' ) ) . '/([a-z0-9-]+)[/]?$' )
	->query( 'index.php?sc_checkout_product_id=$matches[1]' )
	->route()
	->handle( 'BuyPageController@show' );

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
->url( '/surecart/redirect' )
->name( 'redirect' )
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
