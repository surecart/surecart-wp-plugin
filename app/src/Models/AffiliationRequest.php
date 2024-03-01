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
	 * @param array $attributes The model attributes [ 'email' => email@email.com].
	 *
	 * @return self|\WP_Error
	 */
	protected function approve( $id ) {
		$approved = \SureCart::request(
			$this->endpoint . '/' . $id . '/approve',
			[
				'method' => 'POST',
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
}
