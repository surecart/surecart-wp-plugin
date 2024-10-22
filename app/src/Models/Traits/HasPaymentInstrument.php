<?php

namespace SureCart\Models\Traits;

use SureCart\Models\PaymentInstrument;

/**
 * If the model has payment instrument.
 */
trait HasPaymentInstrument {
	/**
	 * Set the payment instrument attribute.
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPaymentInstrumentAttribute( $value ) {
		$this->setRelation( 'payment_instrument', $value, PaymentInstrument::class );
	}

	/**
	 * Get the relation id attribute.
	 *
	 * @return string
	 */
	public function getPaymentInstrumentIdAttribute() {
		return $this->getRelationId( 'payment_instrument' );
	}

	/**
	 * Get the payment instrument types.
	 *
	 * @return string[]
	 */
	public function getPaymentInstrumentTypes(): array {
		return [
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
	}
}
