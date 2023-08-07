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
	protected $fillable = [ 'id', 'webhook_id', 'processed_at', 'data', 'source', 'created_at', 'updated_at', 'deleted_at' ];

	/**
	 * Has this been processed?
	 *
	 * @return boolean
	 */
	protected function getProcessedAttribute() {
		return ! empty( $this->attributes['processed_at'] );
	}

	/**
	 * Serialize the data when setting it.
	 *
	 * @param mixed $value The value to set.
	 */
	protected function setProcessedAttribute( $value ) {
		$this->attributes['processed_at'] = ! empty( $value ) ? current_time( 'mysql' ) : null;
		$this->attributes['processed']    = ! empty( $value );
	}
}
