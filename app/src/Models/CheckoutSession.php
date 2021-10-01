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
	 * Always set discount as object.
	 *
	 * @param array|object $value Value to set.
	 * @return object
	 */
	protected function setDiscountAttribute( $value ) {
		$this->attributes['discount'] = (object) $value;
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
	 * @param  array $value Product properties.
	 * @return void
	 */
	public function setLineItemsAttribute( $value ) {
		$line_items = [];
		if ( ! empty( $value ) ) {
			foreach ( $value as $item ) {
				$line_items[] = new LineItem( $item );
			}
			$this->attributes['line_items'] = $line_items;
		}
	}
}
