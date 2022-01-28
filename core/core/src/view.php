<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'checkout_engine.kernels.http_kernel.respond' );
remove_all_filters( 'checkout_engine.kernels.http_kernel.respond' );
