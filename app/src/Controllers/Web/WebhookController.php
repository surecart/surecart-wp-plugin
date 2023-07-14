<?php

namespace SureCart\Controllers\Web;

use SureCart\Models\Webhook;
use SureCart\Support\Encryption;
use SureCart\Webhooks\WebhooksHistoryService;
use SureCartCore\Responses\RedirectResponse;
use SureCartVendors\Psr\Http\Message\ResponseInterface;

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
		'charge'       => \SureCart\Models\Charge::class,
		'coupon'       => \SureCart\Models\Coupon::class,
		'customer'     => \SureCart\Models\Customer::class,
		'purchase'     => \SureCart\Models\Purchase::class,
		'price'        => \SureCart\Models\Price::class,
		'product'      => \SureCart\Models\Product::class,
		'period'       => \SureCart\Models\Period::class,
		'order'        => \SureCart\Models\Order::class,
		'refund'       => \SureCart\Models\Refund::class,
		'subscription' => \SureCart\Models\Subscription::class,
		'invoice'      => \SureCart\Models\Invoice::class,
		'account'      => \SureCart\Models\Account::class,
	];

	/**
	 * Create new webhook for this site.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return ResponseInterface
	 */
	public function create( $request ) {
		// We'll create a webhook for this site with signing secret.
		\SureCart::webhooks()->createWebhook();
		
		return ( new RedirectResponse( $request ) )->back();
	}

	/**
	 * Update the webhook.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return ResponseInterface
	 */
	public function update( $request ) {
		// Update the webhook url and signing secret.
		$webhook = Webhook::find( $request->query( 'id' ) );
		if ( is_wp_error( $webhook ) ) {
			wp_die( $webhook->get_error_message() );
		}

		$updated = $webhook->update(
			[
				'url' => Webhook::getListenerUrl(),
			]
		);

		if ( is_wp_error( $updated ) ) {
			wp_die( $updated->get_error_message() );
		}

		// Get the previous webhook.
		$previousWebhook = \SureCart::webhooks()->getPreviousWebhook();

		if ( ! $previousWebhook ) {
			return ( new RedirectResponse( $request ) )->back();
		}

		// Delete the previous registered webhook.
		\SureCart::webhooks()->deleteRegisteredWebhookById( $previousWebhook['id'] );

		// Save the updated webhook to webhook history.
		\SureCart::webhooks()->saveRegisteredWebhook(
			[
				'id'  		     => $previousWebhook['id'],
				'url' 			 => Webhook::getListenerUrl(),
				'webhook_events' => $previousWebhook['webhook_events'],
				'signing_secret' => Encryption::encrypt( $previousWebhook['signing_secret'] ),
			]
		);

		return ( new RedirectResponse( $request ) )->back();
	}

	/**
	 * Recieve webhook
	 */
	public function receive( $request ) {
		// get json if sent.
		if ( 'application/json' === $request->getHeaderLine( 'Content-Type' ) ) {
			$body = json_decode( $request->getBody(), true );
		} else {
			$body = $request->getParsedBody();
		}

		// the model does not exist.
		if ( empty( $this->models[ $body['data']['object']['object'] ] ) ) {
			return \SureCart::json(
				[
					'event_triggered' => 'none',
				]
			)
			->withHeader( 'X-SURECART-WP-PLUGIN-VERSION', \SureCart::plugin()->version() )
			->withStatus( 200 );
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
		if ( empty( $request['type'] ) ) {
			return new \WP_Error( 'missing_type', 'Missing type.' );
		}
		if ( empty( $request['data'] ) ) {
			return new \WP_Error( 'missing_data', 'Missing data.' );
		}

		// create the event name.
		$event = $this->createEventName( $request['type'] );
		$id    = $this->getObjectId( $request['data'] );
		$model = new $this->models[ $request['data']['object']['object'] ]( $request['data']['object'] );

		// broadcast the webhook as a background task.
		// if ( defined( 'SURECART_RUNNING_TESTS' ) ) {
		// 	do_action( $event, $model, $request );
		// } else {
			\SureCart::queue()->add(
				$event,
				array(
					'model'   => $model,
					'request' => $request,
				),
				Webhook::GROUP_NAME
			);
		// }

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
		return $data->object->id ?? '';
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
