<?php

namespace Surecart\Integrations\AffiliateWP;

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
class AffiliateWPIntegration extends \Affiliate_WP_Base {
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
		// add pending referrla when the purchase is created.
		add_action( 'surecart/purchase_created', [ $this, 'addPendingReferral' ], 99 );
		// revoke referral when the purchase is revoked.
		add_action( 'surecart/purchase_revoked', [ $this, 'revokeReferral' ], 10, 3 );
		// add a reference link to the referral table.
		add_filter( 'affwp_referral_reference_column', [ $this, 'referenceLink' ], 10, 2 );
	}

	/**
	 * The reference link for the referral.
	 *
	 * @param string $reference The reference id.
	 * @param object $referral The referral object.
	 *
	 * @return string
	 */
	public function referenceLink( $reference, $referral ) {
		if ( empty( $referral->context ) || 'surecart' != $referral->context ) {
			return $reference;
		}

		/** Get the url for the reference. */
		$purchase = Purchase::find( $reference );
		if ( $purchase->order ) {
			$url = esc_url( \SureCart::getUrl()->edit( 'order', $purchase->order ) );
		}
		if ( $purchase->invoice ) {
			$url = esc_url( \SureCart::getUrl()->edit( 'order', $purchase->order ) );
		}

		if ( ! $url ) {
			return $reference;
		}

		return '<a href="' . esc_url( $url ) . '">' . $reference . '</a>';
	}

	/**
	 * Revoke purchase on refund.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 *
	 * @return void
	 */
	public function revokeReferral( $purchase ) {
		if ( ! affiliate_wp()->settings->get( 'revoke_on_refund' ) ) {
			return;
		}

		$this->reject_referral( $purchase->invoice ?? $purchase->order );
	}

	/**
	 * Records a pending referral when a pending payment is created
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 */
	public function addPendingReferral( $purchase ) {
		// Check if it was referred.
		if ( ! $this->was_referred() ) {
			return false; // Referral not created because affiliate was not referred.
		}

		$hydrated_purchase = Purchase::with( [ 'order', 'invoice', 'product', 'customer' ] )->find( $purchase->id );
		$order             = $hydrated_purchase->order;
		$invoice           = $hydrated_purchase->invoice;

		$reference = null;
		if ( ! empty( $order->id ) ) {
			$reference = $order;
		}
		if ( ! empty( $invoice->id ) ) {
			$reference = $invoice;
		}

		// Create draft referral.
		$referral_id = $this->insert_draft_referral(
			$this->affiliate_id,
			[
				'reference' => $reference->id ?? null,
			]
		);

		if ( ! $referral_id || ! $reference->id ) {
			$this->log( 'Draft referral creation failed.' );
			return;
		}

		if ( 'invoice' === $reference->object ) {
			$this->log( 'Processing referral for a subscription.' );
		}
		if ( 'order' === $reference->object ) {
			$this->log( 'Processing referral for an order.' );
		}

		$stripe_amount = $reference->amount_due;
		$currency      = $reference->currency;
		$description   = $purchase->product->name;
		$mode          = $reference->live_mode;

		if ( Currency::isZeroDecimal( $currency ) ) {
			$amount = $stripe_amount;
		} else {
			$amount = round( $stripe_amount / 100, 2 );
		}

		if ( $this->is_affiliate_email( $purchase->customer->email, $this->affiliate_id ) ) {
			$this->log( 'Referral not created because affiliate\'s own account was used.' );
			$this->mark_referral_failed( $referral_id );
			return;
		}

		$referral_total = $this->calculate_referral_amount( $amount, $reference->id );

		// Hydrates the previously created referral.
		$this->hydrate_referral(
			$referral_id,
			array(
				'status'      => 'pending',
				'amount'      => $referral_total,
				'description' => $description,
				'custom'      => array(
					'livemode' => $mode,
				),
			)
		);

		$this->log( 'Pending referral created successfully during insert_referral()' );

		if ( $this->complete_referral( $reference->id ) ) {
			$this->log( 'Referral completed successfully during insert_referral()' );
			return;
		}

		$this->log( 'Referral failed to be set to completed with complete_referral()' );
	}
}
