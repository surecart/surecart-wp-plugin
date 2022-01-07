<?php
namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Webhook;

/**
 * Handles webhooks
 */
class WebhookController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Webhook::class;

	/**
	 * Recieve webhooks
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function recieve( \WP_REST_Request $request ) {
		$type = $this->formatEventType( $request->get_param( 'type' ) );
		if ( $type ) {
			do_action( "checkout_engine/events/$type", $request->get_param( 'data' ), $request );
		}
		return true;
	}

	/**
	 * Replace our dot notation webhook with underscore.
	 *
	 * @param string $type The event type.
	 * @return string
	 */
	public function formatEventType( $type = '' ) {
		return str_replace( '.', '_', $type );
	}
}
