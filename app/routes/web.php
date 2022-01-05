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

\CheckoutEngine::route()
	->post()
	->url( '/checkout_engine/webhooks' )
	->middleware( 'webhooks' )
	->name( 'webhooks' )
	->handle( 'WebhookController@receive' );
