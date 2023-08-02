<?php

namespace SureCart\Controllers\Web;

use SureCart\Models\RegisteredWebhook;
use SureCartCore\Responses\RedirectResponse;
use SureCartVendors\Psr\Http\Message\ResponseInterface;

/**
 * Handles webhooks
 */
class WebhookController {
	/**
	 * Create new webhook for this site.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return ResponseInterface
	 */
	public function create( $request ) {
		// We'll create a webhook for this site register the webhooks.
		$registered = RegisteredWebhook::create();

		// handle error and show notice to user.
		if ( is_wp_error( $registered ) ) {
			// show notice.
			\SureCart::notices()->add(
				[
					'name'  => 'webhooks_registration_error',
					'type'  => 'warning',
					'title' => esc_html__( 'SureCart Webhook Creation Error', 'surecart' ),
					'text'  => sprintf( '<p>%s</p>', ( implode( '<br />', $registered->get_error_messages() ?? [] ) ) ),
				]
			);
		}

		return ( new RedirectResponse( $request ) )->back();
	}

	/**
	 * Update the webhook.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return ResponseInterface
	 */
	public function update( $request ) {
		// Find the registered webhook.
		$webhook = RegisteredWebhook::find();
		if ( is_wp_error( $webhook ) ) {
			wp_die( wp_kses_post( $webhook->get_error_message() ) );
		}

		// update webhook.
		$updated = RegisteredWebhook::update();

		// handle error.
		if ( is_wp_error( $updated ) ) {
			wp_die( wp_kses_post( $updated->get_error_message() ) );
		}

		// redirect back.
		return ( new RedirectResponse( $request ) )->back();
	}

	/**
	 * Recieve webhook.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return ResponseInterface
	 */
	public function receive( $request ) {
		// get json if sent.
		if ( 'application/json' === $request->getHeaderLine( 'Content-Type' ) ) {
			$body = json_decode( $request->getBody(), true );
		} else {
			$body = $request->getParsedBody();
		}

		// validate body.
		if ( empty( $body['type'] ) ) {
			return new \WP_Error( 'missing_type', 'Missing type.' );
		}
		if ( empty( $body['data'] ) ) {
			return new \WP_Error( 'missing_data', 'Missing data.' );
		}

		// perform the action.
		$action = $this->doAction( $body );

		// handle the response.
		return $this->handleResponse( $action );
	}

	/**
	 * Handle the response back to the webhook.
	 *
	 * @param array|\WP_Error $data Data.
	 * @return function
	 */
	public function handleResponse( $data ) {
		// handle the response.
		if ( is_wp_error( $data ) ) {
			return \SureCart::json( [ $data->get_error_code() => $data->get_error_message() ] )
				->withHeader( 'X-SURECART-WP-PLUGIN-VERSION', \SureCart::plugin()->version() )
				->withStatus( 500 );
		}

		if ( empty( $data ) ) {
			return \SureCart::json( [ 'failed' => true ] )
				->withHeader( 'X-SURECART-WP-PLUGIN-VERSION', \SureCart::plugin()->version() )
				->withStatus( 400 );
		}

		return \SureCart::json(
			[
				'event_triggered' => $data['event'] ?? 'none',
				'data'            => $data,
			]
		)
		->withHeader( 'X-SURECART-WP-PLUGIN-VERSION', \SureCart::plugin()->version() )
		->withStatus( 200 );
	}

	/**
	 * Perform the action.
	 *
	 * @param object $request Request.
	 *
	 * @return array|\WP_Error
	 */
	public function doAction( $request ) {
		// create the event name.
		$event = $this->createEventName( $request['type'] );
		$id    = $this->getObjectId( $request['data'] );

		// dispatch an async request.
		\SureCart::async()->data(
			[
				'event'   => $event,
				'id'      => $id,
				'request' => $request,
			]
		)->dispatch();

		// return data.
		return [
			'event'   => $event,
			'id'      => $id,
			'request' => $request,
		];
	}

	/**
	 * Replace our dot notation webhook with underscore.
	 *
	 * @param string $type The event type.
	 * @return string
	 */
	public function createEventName( $type = '' ) {
		$type = str_replace( '.', '_', $type );
		return "surecart/$type";
	}

	/**
	 * Get the first object property in data.
	 *
	 * @param object $data Request data.
	 * @return string
	 */
	public function getObjectId( $data ) {
		return $data['object']['id'] ?? '';
	}

	/**
	 * Find the object name.
	 *
	 * @param object|array $data Request data.
	 * @return string
	 */
	public function getObjectName( $data ) {
		return array_key_first( (array) $data );
	}
}
