<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasSubscriptions;
use CheckoutEngine\Models\LineItem;
use CheckoutEngine\Models\Traits\CanFinalize;
use CheckoutEngine\Models\Traits\HasDiscount;
use CheckoutEngine\Models\Traits\HasPaymentIntent;
use CheckoutEngine\Models\Traits\HasPaymentMethod;
use CheckoutEngine\Models\Traits\HasProcessorType;
use CheckoutEngine\Models\Traits\HasShippingAddress;

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
