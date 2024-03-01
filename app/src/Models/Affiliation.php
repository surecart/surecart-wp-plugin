<?php

namespace SureCart\Models;

/**
 * Affiliation model
 */
class Affiliation extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'affiliations';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'affiliation';

	/**
	 * Activate the affiliation.
	 *
	 * @param string $id Affiliation ID.
	 *
	 * @return self|\WP_Error
	 */
	protected function activate( $id ) {
		if ( $this->fireModelEvent( 'activating' ) === false ) {
			return false;
		}

		$activated = \SureCart::request(
			$this->endpoint . '/' . $id . '/activate',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $activated ) ) {
			return $activated;
		}

		$this->resetAttributes();

		$this->fill( $activated );

		$this->fireModelEvent( 'activated' );

		return $this;
	}

	/**
	 * De-activate the affiliation.
	 *
	 * @param string $id Affiliation ID.
	 *
	 * @return self|\WP_Error
	 */
	protected function deactivate( $id ) {
		if ( $this->fireModelEvent( 'deactivating' ) === false ) {
			return false;
		}

		$deactivated = \SureCart::request(
			$this->endpoint . '/' . $id . '/deactivate',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $deactivated ) ) {
			return $deactivated;
		}

		$this->resetAttributes();

		$this->fill( $deactivated );

		$this->fireModelEvent( 'deactivated' );

		return $this;
	}
}
