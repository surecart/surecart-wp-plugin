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
			return new \WP_Error( 'not_saved', 'Please share the country iso code.' );
		}

		$country = \SureCart::request(
			$this->endpoint . '/' . $code,
		);

		if ( is_wp_error( $country ) ) {
			return $country;
		}

		return $country;
	}
}
