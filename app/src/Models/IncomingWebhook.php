<?php
namespace SureCart\Models;

use SureCart\Models\DatabaseModel;

/**
 * The integration model.
 */
class IncomingWebhook extends DatabaseModel {
	/**
	 * The integrations table name.
	 *
	 * @var string
	 */
	protected $table_name = 'surecart_incoming_webhooks';

	/**
	 * The object name
	 *
	 * @var string
	 */
	protected $object_name = 'incoming_webhook';

	/**
	 * Fillable items.
	 *
	 * @var array
	 */
	protected $fillable = [ 'id', 'webhook_id', 'processed', 'data', 'source', 'created_at', 'updated_at', 'deleted_at' ];

	/**
	 * Unserialize the data when getting it.
	 */
	protected function getDataAttribute() {
		return maybe_unserialize( maybe_unserialize( $this->attributes['data'] ) );
	}

	/**
	 * Serialize the data when setting it.
	 *
	 * @param mixed $value The value to set.
	 */
	protected function setDataAttribute( $value ) {
		$this->attributes['data'] = maybe_serialize( $value );
	}

	/**
	 * Has this been processed?
	 *
	 * @return boolean
	 */
	protected function getProcessedAttribute() {
		return (bool) $this->attributes['processed'];
	}
}
