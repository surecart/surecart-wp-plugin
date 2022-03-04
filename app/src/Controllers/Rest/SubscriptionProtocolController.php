<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\SubscriptionProtocol;

/**
 * Handle Price requests through the REST API
 */
class SubscriptionProtocolController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = SubscriptionProtocol::class;
}
