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
			"id": "8370dee2-e883-4b38-8440-804c93e826da",
			"object": "purchase",
			"live_mode": false,
			"quantity": 1,
			"revoked": false,
			"revoked_at": null,
			"customer": "567b3130-c1bc-4982-acf1-df28b626afd1",
			"initial_order": "a5c946aa-b654-4e73-be9f-366d313db95b",
			"license": null,
			"product": "f6e90ad9-e5d4-44a0-927b-198348489acd",
			"refund": null,
			"subscription": null,
			"created_at": 1672340597,
			"updated_at": 1672340597
		}';
		$purchase = json_decode($json);
		// do_action( 'surecart/subscription_renewed', $purchase);
	}

	/**
	 * Records a recurring referral when a subscription renews
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 */
	public function renewedSubscription( $purchase ) {
		// Check if recurring referral is active
		if ( ! class_exists( 'AffiliateWP_Recurring_Referrals' ) ) {
			affiliate_wp()->utils->log( 'Recurring referral not applied.' );
			return;
		}

		// Check if it was referred.
		if ( ! affiliate_wp()->tracking->was_referred() ) {
			return false; // Referral not created because affiliate was not referred.
		}

		// Get details purchase information
		$hydrated_purchase = Purchase::with( [ 'initial_order', 'order.checkout', 'product', 'customer' ] )->find( $purchase->id );

		// Get the order reference.
		$reference = $hydrated_purchase->initial_order ?? null;

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
		$description   = $hydrated_purchase->product->name;
		$mode          = $reference->live_mode;

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
				'reference'    => $reference->id ?? null,
				'description'  => $description,
				'affiliate_id' => $this->affiliate_id,
				'context'      => $this->context,
				'custom'       => array(
					'livemode' => $mode,
					'object'   => $reference->object,
				),
			]
		);

		if ( ! $referral_id ) {
			affiliate_wp()->utils->log( 'Draft referral creation failed.' );
			return;
		}

		if ( $this->complete_referral( $referral_id ) ) {
			affiliate_wp()->utils->log( 'Referral completed successfully during insert_referral()' );
			return;
		}

	}

}
