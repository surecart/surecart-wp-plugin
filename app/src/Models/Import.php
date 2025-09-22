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
	 * @param string $type The type of import.
	 * @param array  $data The data for the import.
	 *
	 * @return $this|\WP_Error
	 */
	protected function queue( $type, $data = [] ) {
		$this->endpoint = $this->endpoint . '/' . $type;

		if ( ! is_array( $data ) ) {
			return new \WP_Error( 'invalid_data', __( 'Data must be an array.', 'surecart' ) );
		}

		foreach ( $data as $item ) {
			do_action( 'surecart/import/content', $item, $type );
		}

		$created = parent::create( [ 'data' => $data ] );

		if ( is_wp_error( $created ) ) {
			return $created;
		}

		do_action( 'surecart/import/queued', $created, $type );

		return $created;
	}
}
