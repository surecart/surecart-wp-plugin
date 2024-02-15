<?php

namespace SureCart\Models;

/**
 * Price model
 */
class Activation extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'activations';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'activation';

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setLicenseAttribute( $value ) {
		$this->setRelation( 'license', $value, License::class );
	}
}
