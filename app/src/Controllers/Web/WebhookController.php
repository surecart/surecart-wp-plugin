<?php
namespace SureCart\Controllers\Web;

use SureCart\Models\Webhook;
use SureCart\Webhooks\WebhooksHistoryService;
use SureCartCore\Responses\RedirectResponse;

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
		'charge'   => \SureCart\Models\Charge::class,
		'coupon'   => \SureCart\Models\Coupon::class,
		'customer' => \SureCart\Models\Customer::class,
		'purchase' => \SureCart\Models\Purchase::class,
		'price'    => \SureCart\Models\Price::class,
		'product'  => \SureCart\Models\Product::class,
		'period'   => \SureCart\Models\Period::class,
		'order'    => \SureCart\Models\Order::class,
		'refund'   => \SureCart\Models\Refund::class,
		'invoice'  => \SureCart\Models\Invoice::class,
	];

	/**
	 * Remove the webhook.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
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
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
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
				'description' => 'Main webhook for SureCart',
				'enabled'     => true,
				'url'         => \SureCart::routeUrl( 'webhooks.receive' ),
			]
		);
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
		)->withHeader( 'X-SURECART-WP-PLUGIN-VERSION', \SureCart::plugin()->version() );
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
		$model = new $this->models[ $request['data']['object']['object'] ]( $request['data'] );

		// broadcast the webhook.
		do_action( $event, $model, $request );

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
