<?php
namespace SureCart\Models;

use SureCart\Models\Traits\CanFinalize;
use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasSubscription;
use SureCart\Models\Traits\HasPaymentIntent;
use SureCart\Models\Traits\HasPaymentMethod;
use SureCart\Models\Traits\HasProcessorType;

/**
 * Invoice model
 */
class Invoice extends Model {
	use HasCheckout, HasCustomer, HasSubscription, HasPaymentIntent, HasPaymentMethod, CanFinalize, HasProcessorType;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'invoices';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'invoice';

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
	 * Get the checkout page URL for the invoice.
	 *
	 * @return string
	 */
	public function getCheckoutUrlAttribute(): string {
		return \SureCart::getUrl()->checkout() . '?checkout_id=' . $this->checkout_id;
	}

	/**
	 * Make draft invoice.
	 *
	 * @param string|null $id Invoice ID.
	 *
	 * @return self|\WP_Error
	 */
	protected function makeDraft( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'drafting' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', __('Please create the invoice first.', 'surecart') );
		}

		$drafted = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/make_draft',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $drafted ) ) {
			return $drafted;
		}

		$this->resetAttributes();

		$this->fill( $drafted );

		$this->fireModelEvent( 'drafted' );

		return $this;
	}

	/**
	 * Open invoice.
	 *
	 * @param string|null $id Invoice ID.
	 *
	 * @return self|\WP_Error
	 */
	protected function open( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'opening' ) === false ) {
			return $this;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', __('Please create the invoice first.', 'surecart') );
		}

		$opened = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/open',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $opened ) ) {
			return $opened;
		}

		$this->resetAttributes();
		$this->fill( $opened );
		$this->fireModelEvent( 'opened' );

		return $this;
	}
}
