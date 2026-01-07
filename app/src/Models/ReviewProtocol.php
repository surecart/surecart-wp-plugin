<?php

namespace SureCart\Models;

/**
 * ReviewProtocol model.
 */
class ReviewProtocol extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'review_protocol';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'review_protocol';

	/**
	 * Does an update clear account cache?
	 *
	 * @var boolean
	 */
	protected $clears_account_cache = true;
}
