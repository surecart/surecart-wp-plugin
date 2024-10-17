<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;

/**
 * The upsell funnel model.
 */
class UpsellFunnel extends Model {
	use HasDates;

	/**
	 * Rest API endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'upsell_funnels';

	/**
	 * Object name.
	 *
	 * @var string
	 */
	protected $object_name = 'upsell_funnel';

	/**
	 * Set the upsells attribute.
	 *
	 * @param  object $value Array of upsell objects.
	 * @return void
	 */
	public function setUpsellsAttribute( $value ) {
		$this->setCollection( 'upsells', $value, Upsell::class );
	}
}
