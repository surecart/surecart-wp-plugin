<?php

namespace SureCart\Models\Traits;

use SureCart\Support\TimeDate;

/**
 * Format dates for the model.
 */
trait HasDates {
	/**
	 * Get the created at date.
	 *
	 * @return string
	 */
	public function getCreatedAtDateAttribute() {
		return TimeDate::formatDate( $this->created_at );
	}

	/**
	 * Get the created at date time.
	 *
	 * @return string
	 */
	public function getCreatedAtDateTimeAttribute() {
		return TimeDate::formatDateAndTime( $this->created_at );
	}

	/**
	 * Get the updated at date.
	 *
	 * @return string
	 */
	public function getUpdatedAtDateAttribute() {
		return TimeDate::formatDate( $this->updated_at );
	}

	/**
	 * Get the updated at date time.
	 *
	 * @return string
	 */
	public function getUpdatedAtDateTimeAttribute() {
		return TimeDate::formatDateAndTime( $this->updated_at );
	}
}
