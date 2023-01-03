<?php

namespace SureCart\Integrations\AffiliateWP;

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
 * Class AffiliateWPRecurringIntegration
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
		// Add referral when subscription renewed.
		add_action( 'surecart/subscription_renewed', [ $this, 'renewedSubscription' ], 10, 1 );

		// Automated test for subscription renewed
		$json = '{
			"id": "697dbfee-e758-439a-a7a7-ca95804b7791",
			"object": "subscription",
			"ad_hoc_amount": null,
			"cancel_at_period_end": false,
			"currency": "usd",
			"current_period_end_at": null,
			"current_period_start_at": null,
			"end_behavior": "cancel",
			"ended_at": null,
			"finite": false,
			"live_mode": true,
			"metadata": {},
			"pending_update": {},
			"quantity": 1,
			"remaining_period_count": null,
			"status": "active",
			"tax_enabled": false,
			"trial_end_at": null,
			"trial_start_at": null,
			"current_cancellation_act": null,
			"current_period": null,
			"customer": "567b3130-c1bc-4982-acf1-df28b626afd1",
			"discount": null,
			"payment_method": "ae67e307-2e8d-46a0-9aee-3f88999a274d",
			"price": "30eacbd7-5746-4dc3-97fb-b951048116ab",
			"purchase": "1034b845-d743-4873-ba27-8940311a214a",
			"created_at": 1672340602,
			"updated_at": 1672340602
		}';
		$subscription = json_decode($json);
		// do_action( 'surecart/subscription_renewed', $subscription);
	}

	/**
	 * Records a recurring referral when a subscription renews
	 *
	 * @param $subscription Subscription object.
	 */
	public function renewedSubscription( $subscription ) {
		// Check if recurring referral is active
		if ( ! class_exists( 'AffiliateWP_Recurring_Referrals' ) ) {
			affiliate_wp()->utils->log( 'Recurring referral not applied.' );
			return;
		}

		// Get details purchase information
		$purchase = Purchase::with( [ 'initial_order', 'order.checkout', 'product', 'customer' ] )->find( $subscription->purchase );

		// Get the order reference.
		$reference = $purchase->initial_order ?? null;

		// We must have an order id.
		if ( ! $reference->id ) {
			affiliate_wp()->utils->log( 'Draft referral creation failed. No order attached.' );
			return;
		}

		// Get the parent referral
		$parent_referral = affiliate_wp()->referrals->get_by( 'reference', $reference->id, $this->context );

		// This signup wasn't referred or is the very first payment of a referred subscription
		if ( ! $parent_referral || ! is_object( $parent_referral ) || 'rejected' == $parent_referral->status ) {
			affiliate_wp()->utils->log( 'Recurring Referrals: No referral found or referral is rejected.' );
			return false;
		}

		$amount_due    = $reference->checkout->amount_due;
		$currency      = $reference->currency;
		$description   = $purchase->product->name;

		if ( Currency::isZeroDecimal( $currency ) ) {
			$amount = $amount_due;
		} else {
			$amount = round( $amount_due / 100, 2 );
		}

		// Calculate referral amount
		$referral_amount = $this->calc_referral_amount( $amount, $reference, $parent_referral->referral_id );

		// Create referral for subscription.
		$referral_id = $this->insert_referral(
			[
				'amount'       => $referral_amount,
				'reference'    => $reference,
				'description'  => $description,
				'affiliate_id' => $parent_referral->affiliate_id,
				'context'      => $this->context,
			]
		);

		if ( ! $referral_id ) {
			affiliate_wp()->utils->log( 'Draft referral creation failed.' );
			return;
		}

		// Complete referral
		if ( $this->complete_referral( $referral_id ) ) {
			affiliate_wp()->utils->log( 'Referral completed successfully during insert_referral()' );
			return;
		}

	}

}
