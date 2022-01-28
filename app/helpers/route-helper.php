<?php

/**
 * Handles a url $_GET request.
 *
 * @param string $var Url variable value.
 * @param string $name Name of URL var.
 */
function ce_url_var( $var, $name = 'action' ) {
	if ( ! $var ) return empty( $_GET[$name] ); // phpcs:ignore
	return ! empty( $_GET[$name] ) && $var ===  $_GET[$name]; // phpcs:ignore
}

/**
 * Handles a url $_GET request for ce_action.
 *
 * @param string $var Url variable value.
 * @param string $name Name of URL var.
 */
function ce_action( $var, $name = 'ce-action' ) {
	if ( ! $var ) return empty( $_GET[$name] ); // phpcs:ignore
	return ! empty( $_GET[$name] ) && $var ===  $_GET[$name]; // phpcs:ignore
}
