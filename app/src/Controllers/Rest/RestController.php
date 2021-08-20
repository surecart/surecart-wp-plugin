<?php

namespace CheckoutEngine\Controllers\Rest;

/**
 * Rest controller base class.
 */
abstract class RestController {
	/**
	 * Respond to request
	 *
	 * @param \WP_Error|Array $response Response from platform.
	 *
	 * @return \WP_Error|\WP_Rest_Response
	 */
	public function respond( $response ) {
		return is_wp_error( $response ) ? $response : rest_ensure_response( $response );
	}

	/**
	 * Filters a response based on the context defined in the schema.
	 *
	 * @since 4.7.0
	 *
	 * @param array  $data    Response data to filter.
	 * @param string $context Context defined in the schema.
	 * @return array Filtered response.
	 */
	public function filterResponseByContext( $data, $context ) {
		$schema = $this->schema();

		return rest_filter_response_by_context( $data, $schema, $context );
	}

	/**
	 * Schema
	 *
	 * @return void
	 */
	public function schema() {
		return [];
	}
}
