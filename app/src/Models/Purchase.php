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
	protected function revoke( $id = 0 ) {
		$id = $id ? $id : $this->id;

		if ( $this->fireModelEvent( 'revoking' ) === false ) {
			return false;
		}

		if ( empty( $id ) ) {
			return new \WP_Error( 'not_saved', 'You can only revoke an existing purchase.' );
		}

		$model = $this->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			],
			$this->endpoint . '/' . $id . '/revoke/',
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
	protected function invoke( $id = 0 ) {
		$id = $id ? $id : $this->id;

		if ( $this->fireModelEvent( 'invoking' ) === false ) {
			return false;
		}

		if ( empty( $id ) ) {
			return new \WP_Error( 'not_saved', 'You can only invoke an existing purchase.' );
		}

		$model = $this->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->getQuery(),
			],
			$this->endpoint . '/' . $id . '/invoke/',
		);

		if ( is_wp_error( $model ) ) {
			return $model;
		}

		$this->resetAttributes();

		$this->fill( $model );

		$this->fireModelEvent( 'invoked' );

		return $this;
	}

	/**
	 * Has the product changed?
	 */
	protected function getHasProductChangedAttribute() {
		return (bool) $this->getPreviousProductIdAttribute();
	}

	/**
	 * Get the previous product ID.
	 *
	 * @return string
	 */
	protected function getPreviousProductIdAttribute() {
		if ( empty( $this->attributes['previous_attributes']['product'] ) ) {
			return false;
		}
		if ( is_string( $this->attributes['previous_attributes']['product'] ) ) {
			return $this->attributes['previous_attributes']['product'];
		}
		if ( ! empty( $this->attributes['previous_attributes']['product']['id'] ) ) {
			return $this->attributes['previous_attributes']['product']['id'];
		}
		return false;
	}

	/**
	 * Get the previous quantity
	 *
	 * @return integer
	 */
	protected function getPreviousQuantityAttribute() {
		if ( empty( $this->attributes['previous_attributes']['quantity'] ) ) {
			return false;
		}
		return $this->attributes['previous_attributes']['quantity'];
	}
}
