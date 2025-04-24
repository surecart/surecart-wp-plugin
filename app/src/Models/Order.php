<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasDates;

/**
 * Order model
 */
class Order extends Model {
	use HasCheckout;
	use HasDates;

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
	 * Resend the notification for the order.
	 *
	 * @param string $id Model id.
	 * @return $this|\WP_Error
	 */
	protected function resend_notification( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'resending_notification' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_sent', 'The order id is empty.' );
		}

		$resent = $this->makeRequest(
			[
				'method' => 'POST',
				'query'  => $this->query,
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/resend_notification/'
		);

		if ( is_wp_error( $resent ) ) {
			return $resent;
		}

		$this->resetAttributes();

		$this->fill( $resent );

		$this->fireModelEvent( 'resending_notification' );

		return $this;
	}
}
