<?php

namespace SureCart\Models;

/**
 * Import model
 */
class Import extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'imports';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'import';

	/**
	 * Queue a new import.
	 * 
	 * @param array  $data The data for the import.
	 *
	 * @return $this|false
	 */
	protected function queue( $type, $data = [] ) {
		$this->endpoint = $this->endpoint . '/' . $type;

		if ( ! is_array( $data ) ) {
			return new \WP_Error( 'invalid_data', __( 'Data must be an array.', 'surecart' ) );
		}

		foreach ( $data as $item ) {
			$item = \SureCart::sync()->content()->maybeStageContentSync( $item );
		}

		return parent::create( [ 'data' => $data ] );
	}
}