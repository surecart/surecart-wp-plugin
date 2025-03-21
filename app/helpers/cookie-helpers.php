<?php
/**
 * Set a cookie.
 *
 * @param string  $name     The name of the cookie.
 * @param string  $value    The value of the cookie.
 * @param int     $expire   The expiration time of the cookie.
 * @param boolean $secure   Whether the cookie should be served over HTTPS only.
 * @param boolean $httponly Whether the cookie should be accessible via HTTP(S) only.
 */
function sc_setcookie( $name, $value, $expire = 0, $secure = false, $httponly = false ) {
	/**
	 * Controls whether the cookie should be set via sc_setcookie().
	 *
	 * @since 6.3.0
	 *
	 * @param bool    $set_cookie_enabled If sc_setcookie() should set the cookie.
	 * @param string  $name               Cookie name.
	 * @param string  $value              Cookie value.
	 * @param integer $expire             When the cookie should expire.
	 * @param bool    $secure             If the cookie should only be served over HTTPS.
	 */
	if ( ! apply_filters( 'sc_set_cookie_enabled', true, $name, $value, $expire, $secure ) ) {
		return;
	}

	// Makes sure there isn't a headers already sent error.
	if ( ! headers_sent() ) {
		/**
		 * Controls the options to be specified when setting the cookie.
		 *
		 * @see   https://www.php.net/manual/en/function.setcookie.php
		 * @since 6.7.0
		 *
		 * @param array  $cookie_options Cookie options.
		 * @param string $name           Cookie name.
		 * @param string $value          Cookie value.
		 */
		$options = apply_filters(
			'surecart_set_cookie_options',
			array(
				'expires'  => $expire,
				'secure'   => $secure,
				'path'     => COOKIEPATH ? COOKIEPATH : '/',
				'domain'   => COOKIE_DOMAIN,
				/**
				 * Controls whether the cookie should only be accessible via the HTTP protocol, or if it should also be
				 * accessible to Javascript.
				 *
				 * @see   https://www.php.net/manual/en/function.setcookie.php
				 * @since 3.3.0
				 *
				 * @param bool   $httponly If the cookie should only be accessible via the HTTP protocol.
				 * @param string $name     Cookie name.
				 * @param string $value    Cookie value.
				 * @param int    $expire   When the cookie should expire.
				 * @param bool   $secure   If the cookie should only be served over HTTPS.
				 */
				'httponly' => apply_filters( 'surecart_cookie_httponly', $httponly, $name, $value, $expire, $secure ),
			),
			$name,
			$value
		);

		setcookie( $name, $value, $options );
	} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		headers_sent( $file, $line );
		trigger_error( "{$name} cookie cannot be set - headers already sent by {$file} on line {$line}", E_USER_NOTICE ); // @codingStandardsIgnoreLine
	}
}
