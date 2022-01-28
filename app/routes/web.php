<?php
/**
 * Web Routes.
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
| Receive Webhooks
|--------------------------------------------------------------------------
*/
\CheckoutEngine::route()
	->post()
	->url( '/checkout_engine/webhooks' )
	->name( 'webhooks' )
	->middleware( 'webhooks' )
	->handle( 'WebhookController@receive' );

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
// Here we maybe intercept dashboard request if there is a user link and log them in.
\CheckoutEngine::route()
	->get()
	->where( 'post_id', \CheckoutEngine::pages()->getId( 'dashboard' ) )
	->name( 'dashboard' )
	->handle( 'DashboardController@show' );
