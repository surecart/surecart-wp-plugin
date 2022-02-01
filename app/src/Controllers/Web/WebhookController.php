<?php
namespace CheckoutEngine\Controllers\Web;

use CheckoutEngine\Models\Webhook;
use CheckoutEngine\Webhooks\WebHooksHistoryService;
use CheckoutEngineCore\Responses\RedirectResponse;

/**
 * Handles webhooks
 */
class WebhookController {
	/**
	 * Map object names to their models.
	 *
	 * @var array
	 */
	protected $models = [
		'purchase' => \CheckoutEngine\Models\Purchase::class,
	];

	/**
	 * Remove the webhook.
	 *
	 * @param \CheckoutEngineCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function remove( $request ) {
		$deleted = Webhook::delete( $request->query( 'id' ) );
		if ( is_wp_error( $deleted ) ) {
			wp_die( $deleted->get_error_message() );
		}
		return ( new RedirectResponse( $request ) )->back();
	}

	/**
	 * Remove the webhook.
	 *
	 * @param \CheckoutEngineCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function ignore( $request ) {
		$service = new WebHooksHistoryService();
		$service->deletePreviousWebhook();
		return ( new RedirectResponse( $request ) )->back();
	}

	/**
	 * Create a webhook for this install.
	 */
	public function create() {
		return Webhook::create(
			[
				'description' => 'Main webhook for Checkout Engine',
				'enabled'     => true,
				'url'         => \CheckoutEngine::routeUrl( 'webhooks.receive' ),
			]
		);
	}

	/**
	 * Recieve webhook
	 */
	public function receive( $request ) {
		// perform the action.
		$action = $this->doAction( $request->getParsedBody() );
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
			return \CheckoutEngine::json( [ $data->get_error_code() => $data->get_error_message() ] )->withStatus( 500 );
		}

		if ( empty( $data ) ) {
			return \CheckoutEngine::json( [ 'failed' => true ] )->withStatus( 400 );
		}

		return \CheckoutEngine::json(
			[
				'event_triggered' => $data['event'] ?? 'none',
				'data'            => $data['model'] ?? [],
			]
		);
	}

	/**
	 * Perform the action.
	 *
	 * @param object $request Request.
	 *
	 * @return array|\WP_Error
	 */
	public function doAction( $request ) {
		if ( empty( $request['type'] ) ) {
			return new \WP_Error( 'missing_type', 'Missing type.' );
		}
		if ( empty( $request['data'] ) ) {
			return new \WP_Error( 'missing_data', 'Missing data.' );
		}

		// create the event name.
		$object_name = $this->getObjectName( $request['data'] );
		$event       = $this->createEventName( $request['type'] );
		$id          = $this->getObjectId( $request['data'] );

		// perform the action.
		do_action( new $this->models[ $object_name ]( $request['data'] ), $event, $id, $request );

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
		return "checkout_engine/$type";
	}

	/**
	 * Get the first object property in data.
	 *
	 * @param object $data Request data.
	 * @return string
	 */
	public function getObjectId( $data ) {
		$id = current( $data );
		if ( is_string( $id ) ) {
			return $id;
		}
		return $id->id ?? '';
	}

	/**
	 * Find the object name.
	 *
	 * @param object $data Request data.
	 * @return string
	 */
	public function getObjectName( $data ) {
		return key( $data );
	}
}
