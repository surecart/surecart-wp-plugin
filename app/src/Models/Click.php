<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasAffiliation;
use SureCart\Models\Traits\HasDates;
use SureCart\Support\TimeDate;

/**
 * Click model
 */
class Click extends Model {
	use HasAffiliation, HasDates;


	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'clicks';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'click';

	/**
	 * Set the previous click
	 *
	 * @param object $value Array of payout objects.
	 *
	 * @return void
	 */
	public function setPreviousClickAttribute( $value ) {
		$this->setRelation( 'previous_click', $value, self::class );
	}

	/**
	 * Get the expires at date.
	 *
	 * @return string
	 */
	public function getExpiresAtDateAttribute() {
		return ! empty( $this->expires_at ) ? TimeDate::formatDate( $this->expires_at ) : '';
	}

	/**
	 * Get the expires at date and time.
	 *
	 * @return string
	 */
	public function getExpiresAtDateTimeAttribute() {
		return ! empty( $this->expires_at ) ? TimeDate::formatDateAndTime( $this->expires_at ) : '';
	}
}
