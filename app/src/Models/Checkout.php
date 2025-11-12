<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasSubscriptions;
use SureCart\Models\LineItem;
use SureCart\Models\Traits\CanFinalize;
use SureCart\Models\Traits\HasBillingAddress;
use SureCart\Models\Traits\HasDiscount;
use SureCart\Models\Traits\HasInvoice;
use SureCart\Models\Traits\HasPaymentFailures;
use SureCart\Models\Traits\HasPaymentIntent;
use SureCart\Models\Traits\HasPaymentMethod;
use SureCart\Models\Traits\HasProcessorType;
use SureCart\Models\Traits\HasPurchases;
use SureCart\Models\Traits\HasShippingAddress;
use SureCart\Models\Traits\HasShippingChoices;
use SureCart\Support\Currency;
use SureCart\Support\TimeDate;

/**
 * Order model
 */
class Checkout extends Model {
	use HasCustomer;
	use HasSubscriptions;
	use HasDiscount;
	use HasShippingAddress;
	use HasShippingChoices;
	use HasPaymentIntent;
	use HasPaymentMethod;
	use HasPurchases;
	use CanFinalize;
	use HasProcessorType;
	use HasBillingAddress;
	use HasPaymentFailures;
	use HasInvoice;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'checkouts';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'checkout';

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
	 * Get the display subtotal amount attribute.
	 *
	 * @return string
	 */
	public function getAmountDueDisplayAmountAttribute() {
		return Currency::format( $this->amount_due ?? 0, $this->currency );
	}

	/**
	 * Get the display subtotal amount attribute.
	 *
	 * @return string
	 */
	public function getSubtotalDisplayAmountAttribute() {
		return ! empty( $this->subtotal_amount ) ? Currency::format( $this->subtotal_amount, $this->currency ) : '';
	}

	/**
	 * Get the display discounts amount attribute.
	 *
	 * @return string
	 */
	public function getDiscountsDisplayAmountAttribute() {
		return ! empty( $this->discount_amount ) ? Currency::format( $this->discount_amount, $this->currency ) : '';
	}

	/**
	 * Get the display tax reverse charged amount attribute.
	 *
	 * @return string
	 */
	public function getTaxReverseChargedDisplayAmountAttribute() {
		return ! empty( $this->tax_reverse_charged_amount ) ? Currency::format( $this->tax_reverse_charged_amount, $this->currency ) : '';
	}

	/**
	 * Get the display tax reverse charged amount attribute.
	 *
	 * @return string
	 */
	public function getDiscountsDisplayAttribute() {
		return ! empty( $this->discounts ) ? Currency::format( $this->discounts, $this->currency ) : '';
	}

	/**
	 * Get the display scratch amount attribute.
	 *
	 * @return string
	 */
	public function getScratchDisplayAmountAttribute() {
		return Currency::format( (int) ( -$this->total_savings_amount + $this->total_amount ), $this->currency );
	}

	/**
	 * Get the display subtotal amount attribute.
	 *
	 * @return string
	 */
	public function getTrialDisplayAmountAttribute() {
		return ! empty( $this->trial_amount ) ? Currency::format( $this->trial_amount, $this->currency ) : '';
	}

	/**
	 * Get the display remaining amount due attribute.
	 *
	 * @return string
	 */
	public function getRemainingAmountDueDisplayAmountAttribute() {
		return ! empty( $this->remaining_amount_due ) ? Currency::format( $this->remaining_amount_due, $this->currency ) : '';
	}

	/**
	 * Get the display refunded amount attribute.
	 *
	 * @return string
	 */
	public function getRefundedDisplayAmountAttribute() {
		return ! empty( $this->refunded_amount ) ? Currency::format( $this->refunded_amount, $this->currency ) : '';
	}

	/**
	 * Get the display net paid amount attribute.
	 *
	 * @return string
	 */
	public function getNetPaidDisplayAmountAttribute() {
		return ! empty( $this->net_paid_amount ) ? Currency::format( $this->net_paid_amount, $this->currency ) : '';
	}

	/**
	 * Get the display subtotal amount attribute.
	 *
	 * @return string
	 */
	public function getTotalDisplayAmountAttribute() {
		return Currency::format( (int) $this->total_amount, $this->currency );
	}

	/**
	 * Get the display total savings amount attribute.
	 *
	 * @return string
	 */
	public function getTotalSavingsDisplayAmountAttribute() {
		return Currency::format( (int) $this->total_savings_amount, $this->currency );
	}

	/**
	 * Get the display total scratch price attribute.
	 *
	 * @return string
	 */
	public function getTotalScratchDisplayAmountAttribute() {
		return Currency::format( - (int) $this->total_savings_amount + (int) $this->total_amount, $this->currency );
	}

	/**
	 * Get the converts currency attribute.
	 * We should convert currency by default.
	 *
	 * @return bool
	 */
	public function getShowConvertedTotalAttribute() {
		return apply_filters( 'surecart_checkout_show_converted_total', true, $this );
	}

	/**
	 * Get the display full amount attribute.
	 *
	 * @return string
	 */
	public function getFullDisplayAmountAttribute() {
		return ! empty( $this->full_amount ) ? Currency::format( $this->full_amount, $this->currency ) : '';
	}

	/**
	 * Get the display discount amount amount attribute.
	 *
	 * @return string
	 */
	public function getDiscountDisplayAmountAttribute() {
		return ! empty( $this->discount_amount ) ? Currency::format( $this->discount_amount, $this->currency ) : '';
	}

	/**
	 * Get the display bump amount attribute.
	 *
	 * @return string
	 */
	public function getBumpDisplayAmountAttribute() {
		return ! empty( $this->bump_amount ) ? Currency::format( $this->bump_amount, $this->currency ) : '';
	}

	/**
	 * Get the converted total amount attribute.
	 *
	 * @return string
	 */
	public function getConvertedTotalAmountAttribute() {
		if ( $this->is_zero_decimal || empty( $this->total_amount ) ) {
			return $this->total_amount;
		}
		return $this->total_amount / 100;
	}

	/**
	 * Is the checkout an installment.
	 *
	 * @return bool
	 */
	public function getIsInstallmentAttribute() {
		return $this->full_amount !== $this->subtotal_amount;
	}

	/**
	 * Get the line items count attribute.
	 *
	 * @return int
	 */
	public function getLineItemsCountAttribute() {
		if ( empty( $this->line_items ) || empty( $this->line_items->data ) ) {
			return 0;
		}
		return array_reduce(
			$this->line_items->data ?? [],
			function ( $count, $item ) {
				return $count + ( $item->quantity ?? 0 );
			},
			0
		);
	}

	/**
	 * Get the has recurring attribute.
	 *
	 * Do any line items have a recurring price?
	 *
	 * @return bool
	 */
	public function getHasRecurringAttribute() {
		return array_reduce(
			$this->line_items->data ?? [],
			function ( $carry, $item ) {
				return $carry || isset( $item->price->recurring_interval );
			},
			false
		);
	}

	/**
	 * Set attributes during write actions.
	 *
	 * @return void
	 */
	protected function setWriteAttributes() {
		$this->setAttribute( 'ip_address', $this->getIPAddress() );
		if ( isset( $_COOKIE['sc_click_id'] ) ) {
			$this->setAttribute( 'last_click', $_COOKIE['sc_click_id'] );
		}
	}

	/**
	 * Set the upsell funnel attribute
	 *
	 * @param  object $value The data array.
	 * @return void
	 */
	public function setUpsellFunnelAttribute( $value ) {
		$this->setRelation( 'upsell_funnel', $value, UpsellFunnel::class );
	}

	/**
	 * Set the upsell funnel attribute
	 *
	 * @param  object $value The data array.
	 * @return void
	 */
	public function setCurrentUpsellAttribute( $value ) {
		$this->setRelation( 'current_upsell', $value, Upsell::class );
	}

	/**
	 * Set the recommended bumps attribute
	 *
	 * @param  object $value Subscription data array.
	 * @return void
	 */
	public function setRecommendedBumpsAttribute( $value ) {
		$this->setCollection( 'recommended_bumps', $value, Bump::class );
	}

	/**
	 * Create a new model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|\WP_Error|false
	 */
	protected function create( $attributes = [] ) {
		$this->setWriteAttributes();
		return parent::create( $attributes );
	}

	/**
	 * Update the model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|\WP_Error|false
	 */
	protected function update( $attributes = [] ) {
		$this->setWriteAttributes();

		return parent::update( $attributes );
	}

	/**
	 * Get the IP address of the user
	 *
	 * TOD0: Move this to a helper class.
	 *
	 * @return string
	 */
	protected function getIPAddress() {
		return $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
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

	/**
	 * Finalize the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function manuallyPay() {
		if ( $this->fireModelEvent( 'manually_paying' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout session.' );
		}

		$finalized = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/manually_pay/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $finalized ) ) {
			return $finalized;
		}

		$this->resetAttributes();

		$this->fill( $finalized );

		$this->fireModelEvent( 'manually_paid' );

		return $this;
	}

	/**
	 * Cancel an checkout
	 *
	 * @return $this|\WP_Error
	 */
	protected function cancel() {
		if ( $this->fireModelEvent( 'cancelling' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the order.' );
		}

		$cancelled = $this->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/cancel/'
		);

		if ( is_wp_error( $cancelled ) ) {
			return $cancelled;
		}

		$this->resetAttributes();

		$this->fill( $cancelled );

		$this->fireModelEvent( 'cancelled' );

		return $this;
	}

	/**
	 * Offer a bump.
	 *
	 * @param  string|\SureCart\Models\Bump $bump The bump object.
	 *
	 * @return true|\WP_Error
	 */
	protected function offerBump( $bump ) {
		if ( $this->fireModelEvent( 'offering_bump' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout.' );
		}

		$id = is_a( $bump, Bump::class ) ? $bump->id : $bump;

		if ( empty( $id ) ) {
			return new \WP_Error( 'not_saved', 'Please pass an upsell.' );
		}

		$offered = $this->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/offer_bump/' . $id
		);

		if ( is_wp_error( $offered ) ) {
			return $offered;
		}

		return true;
	}

	/**
	 * Offer an upsell.
	 *
	 * @param  string|\SureCart\Models\Upsell $upsell The upsell object.
	 *
	 * @return true|\WP_Error
	 */
	protected function offerUpsell( $upsell ) {
		if ( $this->fireModelEvent( 'offering_upsell' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout.' );
		}

		$id = is_a( $upsell, Upsell::class ) ? $upsell->id : $upsell;

		if ( empty( $id ) ) {
			return new \WP_Error( 'not_saved', 'Please pass an upsell.' );
		}

		$offered = $this->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/offer_upsell/' . $id
		);

		if ( is_wp_error( $offered ) ) {
			return $offered;
		}

		return true;
	}

	/**
	 * Decline an upsell.
	 *
	 * @param  string|\SureCart\Models\Upsell $upsell The upsell object.
	 *
	 * @return $this|\WP_Error
	 */
	protected function declineUpsell( $upsell ) {
		if ( $this->fireModelEvent( 'declining_upsell' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout.' );
		}

		$id = is_a( $upsell, Upsell::class ) ? $upsell->id : $upsell;

		if ( empty( $id ) ) {
			return new \WP_Error( 'not_saved', 'Please pass an upsell.' );
		}

		$declined = $this->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/decline_upsell/' . $id
		);

		if ( is_wp_error( $declined ) ) {
			return $declined;
		}

		$this->resetAttributes();

		$this->fill( $declined );

		$this->fireModelEvent( 'declined' );

		return $this;
	}

	/**
	 * Get the human discount attribute.
	 *
	 * @return string
	 */
	public function getHumanDiscountAttribute() {
		if ( empty( $this->discount->coupon ) ) {
			return '';
		}

		if ( ! empty( $this->discount->coupon->percent_off ) ) {
			if ( ! empty( $this->discount->coupon->amount_off ) && ! empty( $this->currency ) ) {
				return Currency::format( $this->discount->coupon->amount_off, $this->currency );
			}

			return sprintf( __( '%1d%% off', 'surecart' ), $this->discount->coupon->percent_off | 0 );
		}

		return '';
	}

	/**
	 * Get the human discount with duration attribute.
	 *
	 * @return string
	 */
	public function getHumanDiscountWithDurationAttribute() {
		if ( ! $this->hasRecurring ) {
			return $this->human_discount;
		}

		$duration           = $this->discount->coupon->duration ?? '';
		$duration_in_months = $this->discount->coupon->duration_in_months ?? 0;

		switch ( $duration ) {
			case 'once':
				return sprintf( '%s %s', $this->human_discount, __( 'once', 'surecart' ) );
			case 'repeating':
				$months_label = sprintf( _n( '%d month', '%d months', $duration_in_months, 'surecart' ), $duration_in_months );
				return sprintf( '%s for %s', $this->human_discount, $months_label );
			default:
				return $this->human_discount;
		}
	}

	/**
	 * Get the shipping display amount attribute.
	 *
	 * @return string
	 */
	public function getShippingDisplayAmountAttribute() {
		return $this->shipping_amount ? Currency::format( $this->shipping_amount, $this->currency ) : __( 'Free', 'surecart' );
	}

	/**
	 * If the shipping address is required.
	 *
	 * @return bool
	 */
	public function getShippingAddressRequiredAttribute(): bool {
		return in_array( $this->shipping_address_accuracy_requirement, [ 'tax', 'full' ], true );
	}

	/**
	 * Get the paid display amount attribute.
	 *
	 * @return string
	 */
	public function getPaidDisplayAmountAttribute() {
		return Currency::format( $this->paid_amount, $this->currency );
	}

	/**
	 * Get the Paid at Date attribute.
	 *
	 * @return string
	 */
	public function getPaidAtDateAttribute() {
		return ! empty( $this->paid_at ) ? TimeDate::formatDate( $this->paid_at ) : '';
	}

	/**
	 * Get the proration display amount attribute.
	 *
	 * @return string
	 */
	public function getProrationDisplayAmountAttribute() {
		return Currency::format( $this->proration_amount, $this->currency );
	}

	/**
	 * Get the applied balance display amount attribute.
	 *
	 * @return string
	 */
	public function getAppliedBalanceDisplayAmountAttribute() {
		return Currency::format( $this->applied_balance_amount, $this->currency );
	}

	/**
	 * Get the credited balance display amount attribute.
	 *
	 * @return string
	 */
	public function getCreditedBalanceDisplayAmountAttribute() {
		return Currency::format( $this->credited_balance_amount, $this->currency );
	}

	/**
	 * Get the store currency amount due display amount attribute.
	 *
	 * @return string
	 */
	public function getAmountDueDefaultCurrencyDisplayAmountAttribute() {
		return Currency::format( $this->amount_due, $this->currency, [ 'convert' => false ] );
	}

	/**
	 * Get the store currency amount due display amount attribute.
	 *
	 * @return string
	 */
	public function getCurrentCurrencyAttribute() {
		return Currency::getCurrentCurrency();
	}

	/**
	 * Get the tax exclusive display amount attribute.
	 *
	 * @return string
	 */
	public function getTaxExclusiveDisplayAmountAttribute() {
		return Currency::format( $this->tax_exclusive_amount, $this->currency );
	}

	/**
	 * Get the tax inclusive display amount attribute.
	 *
	 * @return string
	 */
	public function getTaxInclusiveDisplayAmountAttribute() {
		return Currency::format( $this->tax_inclusive_amount, $this->currency );
	}

	/**
	 * Get the tax display amount attribute.
	 *
	 * @return string
	 */
	public function getTaxDisplayAmountAttribute() {
		return Currency::format( $this->tax_amount, $this->currency );
	}
}
