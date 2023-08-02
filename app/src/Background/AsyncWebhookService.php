<?php

namespace SureCart\Background;

/**
 * SureCart Queue
 *
 * A job queue using WordPress actions.
 */
class AsyncWebhookService extends AsyncRequest {
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
	 * Enqueue an action to run one time, as soon as possible
	 *
	 * @var string
	 */
	protected $prefix = 'surecart';

	/**
	 * Action for ajax hooks.
	 *
	 * @var string
	 */
	protected $action = 'async_webhook';

	/**
	 * Handle a dispatched request.
	 *
	 * Override this method to perform any actions required
	 * during the async request.
	 */
	protected function handle() {
		error_log( print_r( $_POST, 1 ) );
		// get the event name.
		$event = esc_html( $_POST['event'] ?? '' ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( empty( $event ) ) {
			error_log( 'Webhoooks: no event' );
			return;
		}

		// get the id of the model.
		$id = esc_html( $_POST['id'] ?? '' ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( empty( $id ) ) {
			error_log( 'Webhoooks: no id' );
			return;
		}

		// get model.
		$class = $this->models[ esc_html( $_POST['request']['data']['object']['object'] ?? '' ) ] ?? null; // phpcs:ignore WordPress.Security.NonceVerification.Missing

		error_log( print_r( $event, 1 ) );
		error_log( print_r( $id, 1 ) );
		error_log( print_r( new $class( $_POST['data']['object'] ?? [] ), 1 ) );

		do_action( $event, $id, new $class( $_POST['request']['data']['object'] ?? [] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
	}
}
