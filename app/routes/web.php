<?php
/**
 * Web Routes.
 *
 * @link https://docs.wpemerge.com/#/framework/routing/methods
 *
 * @package SureCart
 */

use SureCart\Middleware\CheckoutRedirectMiddleware;
use SureCart\Middleware\CustomerDashboardMiddleware;
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
| Receive Webhooks
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

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
// Here we maybe intercept dashboard request if there is a user link and log them in.
\SureCart::route()
	->get()
	->middleware( CustomerDashboardMiddleware::class )
	->where( 'post_id', \SureCart::pages()->getId( 'dashboard' ) )
	->name( 'dashboard' )
	->handle( 'DashboardController@show' );
