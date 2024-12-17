<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasPrice;
use SureCart\Models\Traits\HasSubscription;
use SureCart\Support\TimeDate;

/**
 * Period model
 */
class Period extends Model {
	use HasSubscription, HasCheckout, HasPrice;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'periods';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'period';

	/**
	 * Restore a subscription
	 *
	 * @param string $id Model id.
	 * @return $this|\WP_Error
	 */
	protected function retryPayment( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'retrying_payment' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the period.' );
		}

		$restored = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/retry_payment/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $restored ) ) {
			return $restored;
		}

		$this->resetAttributes();

		$this->fill( $restored );

		$this->fireModelEvent( 'payment_retry_success' );

		return $this;
	}

	/**
	 * Get the start at date.
	 *
	 * @return string
	 */
	public function getStartAtDateAttribute() {
		return ! empty( $this->start_at ) ? TimeDate::formatDate( $this->start_at ) : '';
	}

	/**
	 * Get the end at date.
	 *
	 * @return string
	 */
	public function getEndAtDateAttribute() {
		return ! empty( $this->end_at ) ? TimeDate::formatDate( $this->end_at ) : '';
	}

	/**
	 * Get the next payment retry at date time.
	 *
	 * @return string
	 */
	public function getNextPaymentRetryAtDateTimeAttribute() {
		return ! empty( $this->next_payment_retry_at ) ? TimeDate::formatDateAndTime( $this->next_payment_retry_at ) : '';
	}
}
