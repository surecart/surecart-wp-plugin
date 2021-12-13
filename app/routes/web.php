<?php
/**
 * Web Routes.
 * WARNING: Do not use \CheckoutEngine::route()->all() here, otherwise you will override
 * ALL web requests which you most likely do not want to.
 *
 * @link https://docs.wpemerge.com/#/framework/routing/methods
 *
 * @package CheckoutEngine
 */

use CheckoutEngine\Middleware\CustomerDashboardMiddleware;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Default thank you page.
\CheckoutEngine::route()->get()->url( '/thank-you' )->handle( 'PurchaseController@show' );

// \CheckoutEngine::route()->get()->where( 'post_id', \CheckoutEngine::pages()->getId( 'dashboard' ) )->handle( 'DashboardController@show' );

\CheckoutEngine::route()
->where( 'post_id', \CheckoutEngine::pages()->getId( 'dashboard' ) )
->middleware( CustomerDashboardMiddleware::class )
->group(
	function() {
		\CheckoutEngine::route()->get()->where( 'ce_url_var', false, 'tab' )->name( 'orders' )->handle( 'DashboardController@show' );
	}
);
