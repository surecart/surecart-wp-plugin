<?php

namespace CheckoutEngine\Models\Traits;

/**
 * If the model has an attached customer.
 */
trait CanPurgeFile {
	/**
	 * Finalize the session for checkout.
	 *
	 * @param string $file_id File ID.
	 * @return $this|\WP_Error
	 */
	protected function purgeFile( $file_id = '' ) {
		if ( $this->fireModelEvent( 'purgingFile' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the product.' );
		}

		if ( empty( $file_id ) ) {
			return new \WP_Error( 'not_saved', 'Please provide a file id.' );
		}

		$purged = \CheckoutEngine::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/purge_file/' . $file_id,
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

		$this->fireModelEvent( 'filePurged' );

		return $this;
	}

}
