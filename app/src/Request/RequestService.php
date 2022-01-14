<?php

namespace CheckoutEngine\Request;

use CheckoutEngine\Support\Errors;

/**
 * Provide api request functionality.
 */
class RequestService {
	/**
	 * Undocumented variable
	 *
	 * @var string
	 */
	protected $token = '';

	/**
	 * Request URL
	 *
	 * @var string
	 */
	protected $base_url = '';

	/**
	 * The base path for the request.
	 *
	 * @var string
	 */
	protected $base_path;

	/**
	 * Constructor.
	 *
	 * @param string $base_path The rest api base path.
	 */
	public function __construct( $token = '', $base_path = '/api/v1' ) {
		// set the token.
		$this->token = $token;
		// set the base path and url.
		$this->base_path = $base_path;
		$this->base_url  = $this->getBaseUrl();
	}

	/**
	 * The token to use for the request.
	 *
	 * @param string $mode The mode.
	 *
	 * @return string
	 */
	public function getToken() {
		return 'test_RiHtAnf4utLC5QJKBRDWJob5';
	}

	/**
	 * Get base url depending on mode
	 *
	 * @param string $mode 'staging' or 'live'.
	 *
	 * @return string
	 */
	public function getUrlRoot( $mode = 'live' ) {
		switch ( $mode ) {
			case 'staging':
				return 'https://presto-pay-staging.herokuapp.com';
			default:
				return 'https://presto-pay-staging.herokuapp.com';
		}
	}

	/**
	 * Get the base url.
	 */
	public function getBaseUrl() {
		$url = $this->getUrlRoot( 'live' );
		return untrailingslashit( $url ) . trailingslashit( $this->base_path );
	}

	/**
	 * Make the request
	 *
	 * @param string $endpoint Endpoint to request.
	 * @param array  $args Arguments for request.
	 *
	 * @return mixed
	 */
	public function makeRequest( $endpoint, $args = [] ) {
		// we cache this so we can request it several times.
		$cache_key     = $endpoint . wp_json_encode( $args );
		$response_body = wp_cache_get( $cache_key );

		if ( false === $response_body ) {
			// make sure we send json.
			if ( empty( $args['headers']['Content-Type'] ) ) {
				$args['headers']['Content-Type'] = 'application/json';
			}

			// add auth.
			if ( empty( $args['headers']['Authorization'] ) ) {
				$args['headers']['Authorization'] = "Bearer $this->token";
			}

			// parse args.
			$args = wp_parse_args(
				$args,
				[
					'timeout'   => 20,
					'sslverify' => true,
				]
			);

			// filter args and endpoint.
			$args     = apply_filters( 'checkout_engine/request/args', $args, $endpoint );
			$endpoint = apply_filters( 'checkout_engine/request/endpoint', $endpoint, $args );

			// make url.
			$url = trailingslashit( $this->base_url ) . untrailingslashit( $endpoint );

			// add query args.
			if ( ! empty( $args['query'] ) ) {
				$url = add_query_arg( $this->parseArgs( $args['query'] ), $url );
				$url = preg_replace( '/%5B[0-9]+%5D/', '%5B%5D', $url );
				unset( $args['query'] );
			}

			// json encode body.
			if ( ! empty( $args['body'] ) ) {
				if ( 'application/json' === $args['headers']['Content-Type'] ) {
					$args['body'] = wp_json_encode( $this->parseArgs( $args['body'] ) );
				}
			}

			// make request.
			$response = $this->remoteRequest( $url, $args );

			// bail early if it's a wp_error.
			if ( is_wp_error( $response ) ) {
				return $response;
			}

			$response_code = wp_remote_retrieve_response_code( $response );
			$response_body = wp_remote_retrieve_body( $response );

			// check for errors.
			if ( ! in_array( $response_code, [ 200, 201 ], true ) ) {
				$response_body = json_decode( $response_body, true );
				return \CheckoutEngine::errors()->translate( $response_body, $response_code );
			}

			$response_body = json_decode( $response_body );
			wp_cache_set( $cache_key, $response_body );
		}

		// return response.
		return apply_filters( 'checkout_engine/request/response', $response_body, $args, $endpoint );
	}


	/**
	 * Make the remote request.
	 *
	 * @param string $url The url to request.
	 * @param array  $args The args to pass to the request.
	 *
	 * @return mixed
	 */
	public function remoteRequest( $url, $args = [] ) {
		return wp_remote_request( esc_url_raw( $url ), $args );
	}

	/**
	 * Make a get request
	 *
	 * @param string $endpoint Endpoint for the request.
	 * @param array  $args Request arguments.
	 *
	 * @return mixed
	 */
	public function get( $endpoint, $args = [] ) {
		$args['method'] = 'GET';
		return $this->makeRequest( $endpoint, $args );
	}

	/**
	 * Make a post request
	 *
	 * @param string $endpoint Endpoint for the request.
	 * @param array  $args Request arguments.
	 *
	 * @return mixed
	 */
	public function post( $endpoint, $args = [] ) {
		$args['method'] = 'POST';
		return $this->makeRequest( $endpoint, $args );
	}

	/**
	 * Make a put request
	 *
	 * @param string $endpoint Endpoint for the request.
	 * @param array  $args Request arguments.
	 *
	 * @return mixed
	 */
	public function put( $endpoint, $args = [] ) {
		$args['method'] = 'PUT';
		return $this->makeRequest( $endpoint, $args );
	}

	/**
	 * Make a patch request
	 *
	 * @param string $endpoint Endpoint for the request.
	 * @param array  $args Request arguments.
	 *
	 * @return mixed
	 */
	public function patch( $endpoint, $args = [] ) {
		$args['method'] = 'PATCH';
		return $this->makeRequest( $endpoint, $args );
	}

	/**
	 * Make a delete request
	 *
	 * @param string $endpoint Endpoint for the request.
	 * @param array  $args Request arguments.
	 *
	 * @return mixed
	 */
	public function delete( $endpoint, $args = [] ) {
		$args['method'] = 'DELETE';
		return $this->makeRequest( $endpoint, $args );
	}

	/**
	 * Removes empty args
	 *
	 * @param array $args Array of arguments.
	 */
	protected function parseArgs( $args = [] ) {
		if ( ! is_array( $args ) ) {
			return;
		}
		foreach ( $args as $key => $arg ) {
			// unset null.
			if ( null === $arg ) {
				unset( $args[ $key ] );
			}

			// filter out wp params.
			if ( in_array( $key, [ 'locale', 'rest_route' ], true ) ) {
				unset( $args[ $key ] );
			}

			// convert bool to int to prevent getting unset.
			if ( is_bool( $arg ) ) {
				$args[ $key ] = $arg ? 1 : 0;
			}
		}

		return $args;
	}
}
