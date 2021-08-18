<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;

/**
 * Abstract Rest Service Provider interface
 */
abstract class RestServiceProvider extends \WP_REST_Controller implements RestServiceInterface {
	/**
	 * Plugin namespace.
	 *
	 * @var string
	 */
	protected $name = 'checkout-engine';

	/**
	 * API Version
	 *
	 * @var string
	 */
	protected $version = '1';

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = '';

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		// nothing to register.
	}

	/**
	 * Bootstrap routes
	 *
	 * @param  \Pimple\Container $container Service Container.
	 *
	 * @return void
	 */
	public function bootstrap( $container ) {
		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );
	}

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
	}

	/**
	 * Converts an error to a response object.
	 *
	 * This iterates over all error codes and messages to change it into a flat
	 * array. This enables simpler client behaviour, as it is represented as a
	 * list in JSON rather than an object/map.
	 *
	 * @since 5.7.0
	 *
	 * @param WP_Error $error WP_Error instance.
	 *
	 * @return WP_REST_Response List of associative arrays with code and message keys.
	 */
	protected function errorResponse( $error, $validation_errors ) {
		$status = array_reduce(
			$error->get_all_error_data(),
			function ( $status, $error_data ) {
				return is_array( $error_data ) && isset( $error_data['status'] ) ? $error_data['status'] : $status;
			},
			500
		);

		$errors = array();

		foreach ( (array) $error->errors as $code => $messages ) {
			$all_data  = $error->get_all_error_data( $code );
			$last_data = array_pop( $all_data );

			foreach ( (array) $messages as $message ) {
				$formatted = array(
					'code'    => $code,
					'message' => $message,
					'data'    => $last_data,
				);

				if ( $all_data ) {
					$formatted['additional_data'] = $all_data;
				}

				$errors[] = $formatted;
			}
		}

		$data = $errors[0];
		if ( count( $errors ) > 1 ) {
			// Remove the primary error.
			array_shift( $errors );
			$data['additional_errors'] = $errors;
		}

		return new \WP_REST_Response( $data, $status );
	}
}
