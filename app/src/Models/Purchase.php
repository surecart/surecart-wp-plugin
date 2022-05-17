<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasProduct;
use SureCart\Models\Traits\HasRefund;
use SureCart\Models\Traits\HasSubscription;

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
	 * @param string $id Model id.
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

		// purchase revoked event.
		\SureCart::actions()->doOnce( 'surecart/purchase_revoked', $this )->clear( 'surecart/purchase_invoked', $this );

		return $this;
	}

	/**
	 * Invoke the purchase.
	 *
	 * @param string $id Model id.
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

		// purchase invoked event.
		\SureCart::actions()->doOnce( 'surecart/purchase_invoked', $this )->clear( 'surecart/purchase_revoked', $this );

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
