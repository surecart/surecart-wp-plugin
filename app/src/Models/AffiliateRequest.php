<?php

namespace SureCart\Models;

/**
 * Affiliate Request model
 */
class AffiliateRequest extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'affiliation_requests';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'affiliation_request';
}
