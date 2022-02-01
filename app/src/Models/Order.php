<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasSubscriptions;
use CheckoutEngine\Models\LineItem;

/**
 * Order model
 */
class Order extends Model {
	use HasCustomer, HasSubscriptions;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'orders';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'order';

	/**
	 * Processor type
	 *
	 * @var string
	 */
	protected $processor_type = '';

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
	 * Set the processor type
	 *
	 * @param string $type The processor type.
	 * @return $this
	 */
	protected function setProcessor( $type ) {
		$this->processor_type = $type;
		return $this;
	}

	/**
	 * Always set discount as object.
	 *
	 * @param array|object $value Value to set.
	 * @return $this
	 */
	protected function setDiscountAttribute( $value ) {
		$this->attributes['discount'] = (object) $value;
		return $this;
	}

	/**
	 * Always set discount as object.
	 *
	 * @param array|object $value Value to set.
	 * @return $this
	 */
	protected function setShippingAddressAttribute( $value ) {
		$this->attributes['shipping_address'] = (object) $value;
		return $this;
	}

	/**
	 * Finalize the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function finalize() {
		if ( $this->fireModelEvent( 'finalizing' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout session.' );
		}

		if ( empty( $this->processor_type ) ) {
			return new \WP_Error( 'no_processor', 'Please provide a processor' );
		}

		$finalized = \CheckoutEngine::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/finalize/',
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

		$this->fireModelEvent( 'finalized' );

		$this->maybeAssociateUser();

		return $this;
	}

	/**
	 * Maybe create the WordPress user for the purchase.
	 *
	 * @param string $order_id The order id.
	 * @throws \Exception Throws execption for missing data.
	 *
	 * @return \CheckoutEngine\Models\User;
	 */
	protected function maybeAssociateUser() {
		// requires an order, and a customer email and id.
		if ( empty( $this->attributes['id'] ) ||
			empty( $this->attributes['customer']['email'] ) ||
			empty( $this->attributes['customer']['id'] ) ) {
			return false;
		}

		$customer = $this->attributes['customer'];

		// maybe create the user.
		$user = User::findByCustomerId( $customer['id'] );

		// we already have a user for this order.
		if ( ! empty( $user->ID ) ) {
			return $user;
		}

		// find any existing users.
		$existing = User::getUserBy( 'email', $customer['email'] );
		// If they match.
		if ( $existing && $customer['id'] !== $existing->customerId() ) {
			return $existing;
		}

		// if no user, create one with a generated password.
		$created = User::create(
			[
				'user_name'  => ! empty( $customer['name'] ) ? $customer['name'] : $customer['email'],
				'user_email' => $customer['email'],
			]
		);

		if ( is_wp_error( $created ) ) {
			return $created;
		}

		if ( ! empty( $created->ID ) ) {
			return $created;
		}

		return new \WP_Error( 'user_not_created', __( 'User not created.', 'checkout_engine' ) );
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
	 * Don't send prices or price ids with request.
	 *
	 * @param $args array Request arguments.
	 */
	protected function makeRequest( $args = [], $endpoint = '' ) {
		// don't send these accesors.
		unset( $args['prices'] );
		unset( $args['priceIds'] );

		return parent::makeRequest( $args );
	}

	/**
	 * Get order prices
	 *
	 * @return array|null
	 */
	public function getPricesAttribute() {
		$prices = [];
		if ( ! empty( $this->attributes['line_items']->data ) ) {
			foreach ( $this->attributes['line_items']->data as $line_item ) {
				$prices[] = new Price( $line_item->price );
			}
		}
		return empty( $prices ) ? null : $prices;
	}

	/**
	 * Get list of loaded price ids.
	 *
	 * @return array|null;
	 */
	public function getPriceIdsAttribute() {
		$prices = $this->getPricesAttribute();
		if ( empty( $prices ) ) {
			return null;
		}
		return array_column( $prices, 'id' );
	}

	/**
	 * Does the order have a specific price id
	 *
	 * @param string $id string to search for.
	 * @return boolean true if found, false if not.
	 */
	protected function hasPriceId( $id = '' ) {
		$price_ids = $this->getPriceIdsAttribute();
		return empty( $price_ids ) ? false : in_array( $id, $price_ids, true );
	}
}
