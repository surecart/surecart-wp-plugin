<?php
namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasPaymentIntent;

/**
 * Payment intent model.
 */
class PaymentMethod extends Model {
	use HasCustomer, HasPaymentIntent;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'payment_methods';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'payment_method';

	/**
	 * Detach from a customer.
	 *
	 * @return $this|\WP_Error
	 */
	protected function detach() {
		if ( $this->fireModelEvent( 'detaching' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the payment method.' );
		}

		$detached = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/detach/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $detached ) ) {
			return $detached;
		}

		$this->resetAttributes();

		$this->fill( $detached );

		$this->fireModelEvent( 'detached' );

		return $this;
	}

	/**
	 * Get the translated payment method name.
	 *
	 * @return string
	 */
	public function getPaymentMethodNameAttribute()
	{
		$type = $this->payment_instrument->instrument_type ?? '';

		$payment_type_names = [
			'card'         => __('Card', 'surecart'),
			'bank_account' => __('Bank Account', 'surecart'),
			'applepay'     => __('Apple Pay', 'surecart'),
			'bancontact'   => __('Bancontact', 'surecart'),
			'banktransfer' => __('Bank Transfer', 'surecart'),
			'belfius'      => __('Belfius', 'surecart'),
			'creditcard'   => __('Credit Card', 'surecart'),
			'directdebit'  => __('Direct Debit', 'surecart'),
			'eps'          => __('EPS', 'surecart'),
			'giftcard'     => __('Gift Card', 'surecart'),
			'giropay'      => __('Giropay', 'surecart'),
			'ideal'        => __('iDEAL', 'surecart'),
			'sepa_debit'   => __('SEPA Debit', 'surecart'),
			'in3'          => __('In3', 'surecart'),
			'kbc'          => __('KBC', 'surecart'),
			'klarna'       => __('Klarna', 'surecart'),
			'mybank'       => __('MyBank', 'surecart'),
			'paysafecard'  => __('Paysafecard', 'surecart'),
			'przelewy24'   => __('Przelewy24', 'surecart'),
			'sofort'       => __('Sofort', 'surecart'),
			'voucher'      => __('Voucher', 'surecart'),
		];

		// Check if the type exists in our map.
		if ( isset( $payment_type_names[ $type ] ) ) {
			return $payment_type_names[ $type ];
		}

		// Return the type with the first letter capitalized.
		return ucfirst( $type );
	}
}
