<?php

namespace SureCart\Models;

/**
 * Order model
 */
class Order extends Model {
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
	 * Set the checkout attribute
	 *
	 * @param  object $value Checkout properties.
	 * @return void
	 */
	public function setCheckoutAttribute( $value ) {
		$this->setRelation( 'checkout', $value, Checkout::class );
	}

	/**
	 * Get stats for the order.
	 *
	 * @param array $args Array of arguments for the statistics.
	 *
	 * @return \SureCart\Models\Statistic;
	 */
	protected function stats( $args = [] ) {
		$stat = new Statistic();
		return $stat->where( $args )->find( 'orders' );
	}

	/**
	 * Cancel an order
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
