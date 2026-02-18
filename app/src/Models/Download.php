<?php

namespace SureCart\Models;

/**
 * Price model
 */
class Download extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'downloads';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'download';

	/**
	 * Set the variant attribute
	 *
	 * @param  mixed $value Variant properties.
	 * @return void
	 */
	public function setVariantAttribute( $value ) {
		$this->setRelation( 'variant', $value, Variant::class );
	}
}
