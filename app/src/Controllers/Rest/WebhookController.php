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
		return '';
	}
}
