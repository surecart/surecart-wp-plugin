<?php
/**
 * WordPress AJAX Routes.
 * WARNING: Do not use \CheckoutEngine::route()->all() here, otherwise you will override
 * ALL AJAX requests which you most likely do not want to do.
 *
 * @link https://docs.wpemerge.com/#/framework/routing/methods
 *
 * @package CheckoutEngine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

\CheckoutEngine::route()->get()->where( 'ajax', 'ce-rest-nonce', true, true )->handle( 'NonceController@get' );
