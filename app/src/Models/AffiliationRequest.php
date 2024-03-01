<?php

namespace SureCart\Models;

/**
 * Affiliation Request model
 */
class AffiliationRequest extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'affiliation_requests';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'affiliation_request';

	/**
	 * Approve the affiliate request.
	 *
	 * @param string $id Request ID.
	 *
	 * @return self|\WP_Error
	 */
	protected function approve( $id ) {
		if ( $this->fireModelEvent( 'approving' ) === false ) {
			return false;
		}

		$approved = \SureCart::request(
			$this->endpoint . '/' . $id . '/approve',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $approved ) ) {
			return $approved;
		}

		$this->resetAttributes();

		$this->fill( $approved );

		$this->fireModelEvent( 'approved' );

		return $this;
	}

	/**
	 * Deny the affiliate request.
	 *
	 * @param string $id The model id.
	 *
	 * @return self|\WP_Error
	 */
	protected function deny( $id ) {
		if ( $this->fireModelEvent( 'denying' ) === false ) {
			return false;
		}

		$denied = \SureCart::request(
			$this->endpoint . '/' . $id . '/deny',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $denied ) ) {
			return $denied;
		}

		$this->resetAttributes();

		$this->fill( $denied );

		$this->fireModelEvent( 'denied' );

		return $this;
	}
}
