<?php

namespace CheckoutEngine\Request;

use CheckoutEngine\Support\Errors;

/**
 * Provide api request functionality.
 */
class RequestService {

	/**
	 * Request mode
	 *
	 * @var string
	 */
	protected $mode = 'live';

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
	 * @param string $token to make the request.
	 * @param string $mode Request mode.
	 * @param string $base_path The rest api base path
	 */
	public function __construct( $token, $mode = 'live', $base_path = '/api/v1' ) {
		$this->mode      = $mode;
		$this->token     = $token;
		$this->base_path = $base_path;

		// set the url.
		$url            = $this->getBaseUrl( $mode );
		$this->base_url = untrailingslashit( $url ) . trailingslashit( $this->base_path );
	}

	/**
	 * Get base url depending on mode
	 *
	 * @param string $mode 'staging' or 'live'.
	 *
	 * @return string
	 */
	public function getBaseUrl( $mode = 'live' ) {
		switch ( $mode ) {
			case 'staging':
				return 'https://presto-pay-staging.herokuapp.com';
			default:
				return 'https://presto-pay-staging.herokuapp.com';
		}
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
				'timeout'   => 10,
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
			unset( $args['query'] );
		}

		// json encode body.
		if ( ! empty( $args['body'] ) ) {
			if ( 'application/json' === $args['headers']['Content-Type'] ) {
				$args['body'] = wp_json_encode( $this->parseArgs( $args['body'] ) );
			}
		}

		// make request.
		$response      = wp_remote_request( esc_url_raw( $url ), $args );
		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );

		// check for errors.
		if ( ! in_array( $response_code, [ 200, 201 ], true ) ) {
			$response_body = json_decode( $response_body, true );
			return Errors::formatAndTranslate( $response_body, $response_code );
		}

		// return response.
		return apply_filters( 'checkout_engine/request/response', json_decode( $response_body ), $args, $endpoint );
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
	protected function parseArgs( $args ) {
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
