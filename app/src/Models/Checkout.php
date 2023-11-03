<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasSubscriptions;
use SureCart\Models\LineItem;
use SureCart\Models\Traits\CanFinalize;
use SureCart\Models\Traits\HasDiscount;
use SureCart\Models\Traits\HasPaymentIntent;
use SureCart\Models\Traits\HasPaymentMethod;
use SureCart\Models\Traits\HasProcessorType;
use SureCart\Models\Traits\HasPurchases;
use SureCart\Models\Traits\HasShippingAddress;

/**
 * Order model
 */
class Checkout extends Model {
	use HasCustomer,
		HasSubscriptions,
		HasDiscount,
		HasShippingAddress,
		HasPaymentIntent,
		HasPaymentMethod,
		HasPurchases,
		CanFinalize,
		HasProcessorType;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'checkouts';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'checkout';

	/**
	 * Need to pass the processor type on create
	 *
	 * @param array  $attributes Optional attributes.
	 * @param string $type stripe, paypal, etc.
	 */
	public function __construct( $attributes = [], $type = '' ) {
		$this->processor_type = $type;
		parent::__construct( $attributes );
	}

	/**
	 * Set attributes during write actions.
	 *
	 * @return void
	 */
	protected function setWriteAttributes() {
		$this->setAttribute( 'ip_address', $this->getIPAddress() );
		if ( isset( $_COOKIE['sc_click_id'] ) ) {
			$this->setAttribute( 'last_click', $_COOKIE['sc_click_id'] );
		}
	}

	/**
	 * Create a new model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|\WP_Error|false
	 */
	protected function create( $attributes = [] ) {
		$this->setWriteAttributes();
		return parent::create( $attributes );
	}

	/**
	 * Update the model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|\WP_Error|false
	 */
	protected function update( $attributes = [] ) {
		$this->setWriteAttributes();
		return parent::update( $attributes );
	}

	/**
	 * Get the IP address of the user
	 *
	 * TOD0: Move this to a helper class.
	 *
	 * @return string
	 */
	protected function getIPAddress() {
		return $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
	}

	/**
	 * Set the product attribute
	 *
	 * @param  object $value Product properties.
	 * @return void
	 */
	public function setLineItemsAttribute( $value ) {
		$this->setCollection( 'line_items', $value, LineItem::class );
	}

	/**
	 * Finalize the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function manuallyPay() {
		if ( $this->fireModelEvent( 'manually_paying' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout session.' );
		}

		$finalized = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/manually_pay/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $finalized ) ) {
			return $finalized;
		}

		$this->resetAttributes();

		$this->fill( $finalized );

		$this->fireModelEvent( 'manually_paid' );

		return $this;
	}

	/**
	 * Cancel an checkout
	 *
	 * @return $this|\WP_Error
	 */
	protected function cancel() {
		if ( $this->fireModelEvent( 'cancelling' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the order.' );
		}

		$cancelled = $this->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/cancel/'
		);

		if ( is_wp_error( $cancelled ) ) {
			return $cancelled;
		}

		$this->resetAttributes();

		$this->fill( $cancelled );

		$this->fireModelEvent( 'cancelled' );

		return $this;
	}
}
