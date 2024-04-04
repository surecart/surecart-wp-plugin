<?php
namespace SureCart\Models;

use SureCart\Models\DatabaseModel;

/**
 * The integration model.
 */
class VariantOptionValue extends DatabaseModel {
	/**
	 * The integrations table name.
	 *
	 * @var string
	 */
	protected $table_name = 'surecart_variant_option_values';

	/**
	 * The object name
	 *
	 * @var string
	 */
	protected $object_name = 'variant_option_values';

	/**
	 * Fillable items.
	 *
	 * @var array
	 */
	protected $fillable = [ 'id', 'value', 'name', 'post_id', 'updated_at', 'created_at' ];
}
