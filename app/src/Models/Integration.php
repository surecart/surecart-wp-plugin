<?php
namespace SureCart\Models;

use SureCart\Models\DatabaseModel;

/**
 * The integration model.
 */
class Integration extends DatabaseModel {
	/**
	 * The integrations table name.
	 *
	 * @var string
	 */
	protected $table_name = 'surecart_integrations';

	/**
	 * The object name
	 *
	 * @var string
	 */
	protected $object_name = 'integration';

	/**
	 * Always use integer for integration_id.
	 *
	 * @param mixed $value
	 *
	 * @return void
	 */
	public function setIntegrationIdAttribute( $value ) {
		$this->attributes['integration_id'] = (int) $value;
	}
}
