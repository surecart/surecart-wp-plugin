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
		return parent::create( [ 'data' => $data ] );
	}
}