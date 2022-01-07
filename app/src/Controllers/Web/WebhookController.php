<?php
namespace CheckoutEngine\Controllers\Web;

use WPEmerge\Requests\RequestInterface;

/**
 * Handles webhooks
 */
class WebhookController {
	/**
	 * Get expected json request body.
	 *
	 * @return object
	 */
	public function getInput() {
		return json_decode( file_get_contents( 'php://input' ) );
	}

	/**
	 * Recieve webhooks
	 */
	public function receive() {
		$json = $this->getInput();
		if ( ! empty( $json->type ) ) {
			$event = $this->createEventName( $json->type );
			do_action( $event, $json );
		}

		return \CheckoutEngine::json(
			[
				'event_triggered' => $event ?? 'none',
				'data'            => $json->data ?? [],
			]
		);
	}

	/**
	 * Replace our dot notation webhook with underscore.
	 *
	 * @param string $type The event type.
	 * @return string
	 */
	public function createEventName( $type = '' ) {
		$type = str_replace( '.', '_', $type );
		return "checkout_engine/events/$type";
	}
}
