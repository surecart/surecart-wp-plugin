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

use CheckoutEngine\Middleware\LoginMiddleware;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Customer dashboard.
\CheckoutEngine::route()
->where( 'post_id', \CheckoutEngine::pages()->getId( 'dashboard' ) )
->group(
	function() {
		\CheckoutEngine::route()->get()->name( 'dashboard.show' )->handle( 'DashboardController@show' );
		\CheckoutEngine::route()->post()->middleware( LoginMiddleware::class )->name( 'dashboard.login' )->handle( 'DashboardController@login' );
	}
);

