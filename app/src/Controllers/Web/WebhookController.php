<?php
namespace CheckoutEngine\Controllers\Web;

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
	 * Recieve webhook
	 */
	public function receive() {
		// get the request body.
		$data = $this->getInput();
		// perform the action.
		$action = $this->doAction( $data );
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
			return \CheckoutEngine::json( [ $data->get_error_code() => $data->get_error_message() ] )->withStatus( 400 );
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
		if ( empty( $request->type ) ) {
			return new \WP_Error( 'missing_type', 'Missing type.' );
		}

		$event      = $this->createEventName( $request->type );
		$model_name = $this->getModel( $request->data );

		if ( empty( $model_name ) ) {
			return new \WP_Error( 'invalid_object', 'This object type is not found.' );
		}

		$model = new $model_name( $request->data );
		do_action( $event, $model, $request );

		return [
			'event' => $event,
			'model' => $model->toArray(),
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
		return "checkout_engine/events/$type";
	}

	/**
	 * Get the registered models from the config file.
	 *
	 * @return array
	 */
	public function getRegisteredModels() {
		$service = \CheckoutEngine::resolve( WPEMERGE_CONFIG_KEY );
		return $service['models'];
	}

	/**
	 * Get the model based on the object type.
	 *
	 * @param object $data The event type.
	 * @return string model name
	 */
	public function getModel( $data ) {
		$name   = $data->object ?? '';
		$models = $this->getRegisteredModels();
		return $models[ $name ] ?? '';
	}
}
