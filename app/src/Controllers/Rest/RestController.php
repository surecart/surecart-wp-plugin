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
}
