<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasProduct;
use CheckoutEngine\Models\Traits\HasRefund;
use CheckoutEngine\Models\Traits\HasSubscription;

/**
 * Purchase model.
 */
class Purchase extends Model {
	use HasCustomer, HasProduct, HasSubscription, HasRefund;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'purchases';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'purchase';

	/**
	 * Revoke the purchase.
	 *
	 * @return $this|\WP_Error
	 */
	protected function revoke() {
		if ( $this->fireModelEvent( 'revoking' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'You can only revoke an existing purchase.' );
		}

		$model = $this->makeRequest(
			$this->endpoint . '/' . $this->attributes['id'] . '/revoke/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $model ) ) {
			return $model;
		}

		$this->resetAttributes();

		$this->fill( $model );

		$this->fireModelEvent( 'revoked' );

		return $this;
	}

	/**
	 * Invoke the purchase.
	 *
	 * @return $this|\WP_Error
	 */
	protected function invoke() {
		if ( $this->fireModelEvent( 'invoking' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'You can only invoke an existing purchase.' );
		}

		$model = $this->makeRequest(
			$this->endpoint . '/' . $this->attributes['id'] . '/invoke/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $model ) ) {
			return $model;
		}

		$this->resetAttributes();

		$this->fill( $model );

		$this->fireModelEvent( 'invoked' );

		return $this;
	}
}
