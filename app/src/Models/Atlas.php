<?php

namespace SureCart\Models;

/**
 * Atlas model
 */
class Atlas extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'public/atlas';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'atlas';

	/**
	 * Get a specific country details.
	 *
	 * @param string $code Country iso code.
	 *
	 * @return $this|\WP_Error
	 */
	protected function getCountryDetails( $code = false ) {
		if ( empty( $code ) ) {
			return new \WP_Error( 'missing_country_code', __( 'Country ISO code is required.', 'surecart' ) );
		}

		return \SureCart::request(
			$this->endpoint . '/' . $code,
		);
	}
}
