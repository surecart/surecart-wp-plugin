<?php

namespace SureCart\Support;

/**
 * Handles server functions
 */
class Server {
	/**
	 * Are we on the localhost?
	 *
	 * @return boolean
	 */
	public function isLocalHost() {
		// check the ip address.
		if ( self::isLocalIP() ) {
			return true;
		}

		// check the domain for .local or .test.
		if ( self::isLocalDomain() ) {
			return true;
		}

		return false;
	}

	/**
	 * Check if the site is a local domain (.local or .test.)
	 *
	 * @return boolean
	 */
	public function isLocalDomain() {
		$tld = end( explode( '.', wp_parse_url( get_site_url(), PHP_URL_HOST ) ) );
		return in_array( $tld, array( 'local', 'test' ), true );
	}

	/**
	 * Is this a local IP address?
	 *
	 * @return boolean
	 */
	public function isLocalIP() {
		return in_array( $_SERVER['REMOTE_ADDR'], array( '127.0.0.1', '::1' ), true );
	}
}
