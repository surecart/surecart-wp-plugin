<?php
namespace CheckoutEngine\Controllers\Web;

use CheckoutEngine\Models\Webhook;

/**
 * Handles webhooks
 */
class WebhookController {
	/**
	 * Create the webhook.
	 *
	 * @return void
	 */
	public function create() {
		Webhook::create(
			[
				'description' => get_blog_option( get_current_blog_id(), 'blogname' ),
				'enabled'     => true,
				'url'         => \CheckoutEngine::routeUrl( 'webhooks' ),
			]
		);
	}

	/**
	 * Receive webhooks
	 *
	 * @return void
	 */
	public function receive() {

	}
}
