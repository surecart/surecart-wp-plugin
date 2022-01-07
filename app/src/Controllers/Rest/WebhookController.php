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
}
