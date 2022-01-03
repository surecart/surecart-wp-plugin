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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Customer dashboard.
\CheckoutEngine::route()
->where( 'post_id', \CheckoutEngine::pages()->getId( 'dashboard' ) )
->get()->name( 'dashboard' )->handle( 'DashboardController@show' );
