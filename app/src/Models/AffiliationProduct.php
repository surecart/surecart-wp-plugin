<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCommissionStructure;
use SureCart\Support\TimeDate;

/**
 * AffiliationProduct Model
 */
class AffiliationProduct extends Model {
	use HasCommissionStructure;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'affiliation_products';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'affiliation_product';
}
