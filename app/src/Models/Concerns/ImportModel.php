<?php

namespace SureCart\Models\Concerns;

use SureCart\Models\Import;
use SureCart\Models\Model;

/**
 * Import model trait
 */
abstract class ImportModel extends Model {
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
	 * Find a product import by id.
	 *
	 * @param string $id The id of the product import.
	 *
	 * @return Import|false
	 */
	protected function find( $id = '' ) {
		return ( new Import() )->find( $id );
	}

	/**
	 * Get a product import by id.
	 *
	 * @param array $args Pagination args.
	 * @return mixed
	 */
	protected function paginate( $args = [] ) {
		return ( new Import() )->paginate( $args );
	}

	/**
	 * Fetch a list of items
	 *
	 * @return array|\WP_Error;
	 */
	protected function get() {
		return ( new Import() )->get();
	}
}
