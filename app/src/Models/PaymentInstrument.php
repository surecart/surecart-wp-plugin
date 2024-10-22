<?php
namespace SureCart\Models;

/**
 * Payment instrument model.
 */
class PaymentInstrument extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'payment_instruments';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'payment_instrument';
}
