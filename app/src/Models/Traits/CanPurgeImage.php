<?php

namespace SureCart\Models\Traits;

/**
 * If the model has an attached customer.
 */
trait CanPurgeImage {
	/**
	 * Finalize the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function purgeImage() {
		if ( $this->fireModelEvent( 'purgingImage' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the product.' );
		}

		$purged = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/purge_image/',
			[
				'method' => 'DELETE',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $purged ) ) {
			return $purged;
		}

		$this->resetAttributes();

		$this->fill( $purged );

		$this->fireModelEvent( 'imagePurged' );

		return $this;
	}

}
