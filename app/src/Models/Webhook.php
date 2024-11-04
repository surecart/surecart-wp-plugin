<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;
use SureCart\Support\TimeDate;

/**
 * Webhook Model.
 */
class Webhook extends Model {
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'webhook_endpoints';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'webhook_endpoint';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when webhook endpoints are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'webhook_endpoints';

	/**
	 * Get the erroring grace period ends at date time attribute.
	 *
	 * @return string
	 */
	public function getErroringGracePeriodEndsAtDateTimeAttribute() {
		return ! empty( $this->erroring_grace_period_ends_at ) ? TimeDate::formatDateAndTime( $this->erroring_grace_period_ends_at ) : '';
	}
}
