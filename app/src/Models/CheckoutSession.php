<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\LineItem;

/**
 * CheckoutSession model
 */
class CheckoutSession extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'checkout_sessions';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'checkout_session';

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
			$this->endpoint . '/' . $this->attributes['id'] . '/finalize/' . $this->processor_type,
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->toArray(),
				],
			]
		);

		if ( is_wp_error( $finalized ) ) {
			return $finalized;
		}

		$this->resetAttributes();

		$this->fill( $finalized );

		$this->fireModelEvent( 'finalized' );

		return $this;
	}

	/**
	 * Set the product attribute
	 *
	 * @param  object $value Product properties.
	 * @return void
	 */
	public function setLineItemsAttribute( $value ) {
		$models = [];
		if ( ! empty( $value->data ) && is_array( $value->data ) ) {
			foreach ( $value->data as $attributes ) {
				$models[] = new LineItem( $attributes );
			}
			$value->data = $models;
		}
		$this->attributes['line_items'] = $value;
	}
}
