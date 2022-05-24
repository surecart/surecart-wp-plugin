<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasSubscriptions;
use SureCart\Models\LineItem;
use SureCart\Models\Traits\CanFinalize;
use SureCart\Models\Traits\HasDiscount;
use SureCart\Models\Traits\HasPaymentIntent;
use SureCart\Models\Traits\HasPaymentMethod;
use SureCart\Models\Traits\HasProcessorType;
use SureCart\Models\Traits\HasPurchases;
use SureCart\Models\Traits\HasShippingAddress;

/**
 * Order model
 */
class Order extends Model {
	use HasCustomer,
		HasSubscriptions,
		HasDiscount,
		HasShippingAddress,
		HasPaymentIntent,
		HasPaymentMethod,
		HasPurchases,
		CanFinalize,
		HasProcessorType;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'orders';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'order';

	/**
	 * Need to pass the processor type on create
	 *
	 * @param array  $attributes Optional attributes.
	 * @param string $type stripe, paypal, etc.
	 */
	public function __construct( $attributes = [], $type = '' ) {
		$this->processor_type = $type;
		parent::__construct( $attributes );
	}

	/**
	 * Set the product attribute
	 *
	 * @param  object $value Product properties.
	 * @return void
	 */
	public function setLineItemsAttribute( $value ) {
		$this->setCollection( 'line_items', $value, LineItem::class );
	}
}
