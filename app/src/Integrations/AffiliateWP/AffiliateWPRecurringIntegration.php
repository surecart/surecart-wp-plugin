<?php

namespace Surecart\Integrations\AffiliateWP;

use SureCart\Models\Checkout;
use SureCart\Models\Purchase;
use SureCart\Support\Currency;

/**
 * Custom Integration Class
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Custom_Integration
 * Use this class to ext
 */
class AffiliateWPRecurringIntegration extends \Affiliate_WP_Recurring_Base {
	/**
	 * The context for referrals. This refers to the integration that is being used.
	 *
	 * @access  public
	 * @var string
	 */
	public $context = 'surecart';

	/**
	 * Get things started
	 *
	 * @access  public
	 * @since   2.0
	 */
	public function init() {
		// add pending referral when subscription renewed.
		add_action( 'surecart/subscription_renewed', [ $this, 'renewedSubscription' ], 10, 2 );
	}

	/**
	 * Records a recurring referral when a subscription renews
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 */
	public function renewedSubscription( $purchase ) {
		// check if recurring referral is active
		if ( ! class_exists( 'AffiliateWP_Recurring_Referrals' ) ) {
			return;
		}

		// the integration is not active.
		// if ( ! $this->is_active() ) {
		// 	return;
		// }

		// Check if it was referred.
		if ( ! affiliate_wp()->tracking->was_referred() ) {
			return false; // Referral not created because affiliate was not referred.
		}

		$hydrated_purchase = Purchase::with( [ 'initial_order', 'order.checkout', 'product', 'customer' ] )->find( $purchase->id );

		// get the order reference.
		$reference = $hydrated_purchase->initial_order ?? null;

		// we must have an order id.
		if ( ! $reference->id ) {
			// $this->log( 'Draft referral creation failed. No order attached.' );
			return;
		}

		$stripe_amount = $reference->checkout->amount_due;
		$currency      = $reference->currency;
		$description   = $hydrated_purchase->product->name;
		$mode          = $reference->live_mode;

		if ( Currency::isZeroDecimal( $currency ) ) {
			$amount = $stripe_amount;
		} else {
			$amount = round( $stripe_amount / 100, 2 );
		}

		// Create pending referral for subscription.
		$referral_id = $this->insert_referral(
			[
				'affiliate_id' => $this->affiliate_id,
				'reference' => $reference->id ?? null,
				'amount' => $amount,
				'description' => $description,
				'context' => $this->context,
			]
		);

		if ( ! $referral_id ) {
			// $this->log( 'Draft referral creation failed.' );
			return;
		}

	}

}
