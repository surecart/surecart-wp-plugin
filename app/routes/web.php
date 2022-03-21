<?php
/**
 * Web Routes.
 *
 * @link https://docs.wpemerge.com/#/framework/routing/methods
 *
 * @package SureCart
 */

use SureCart\Middleware\CustomerDashboardMiddleware;

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
