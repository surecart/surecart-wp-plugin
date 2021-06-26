<?php

namespace CheckoutEngine\Models;

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
	 * Prepare the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function prepare( $ ) {
		if ( $this->fireModelEvent( 'preparing' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout session.' );
		}

		$prepared = \CheckoutEngine::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/prepare/' . $this->processor_type,
			[
				'method' => 'PATCH',
				'body'   => [
					$this->object_name => $this->attributes,
				],
			]
		);

		if ( is_wp_error( $prepared ) ) {
			return $prepared;
		}

		$this->resetAttributes();

		$this->fill( $prepared );

		$this->fireModelEvent( 'prepared' );

		return $this;
	}
}
