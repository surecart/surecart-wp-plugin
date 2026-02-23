<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle learn progress requests through the REST API.
 */
class LearnProgressController extends RestController {
	/**
	 * The user meta key for storing learn progress.
	 *
	 * @var string
	 */
	protected $meta_key = 'sc_learn_progress';

	/**
	 * Valid step IDs that can be saved as completed.
	 *
	 * @var array
	 */
	const VALID_STEP_IDS = [
		'complete-setup',
		'add-store-details',
		'add-brand-details',
		'configure-shipping',
		'add-product-details',
		'add-product-variants',
		'publish-product',
		'connect-payment',
		'test-payment',
		'customize-checkout-form',
		'setup-shop-page',
		'view-orders',
		'customer-portal',
		'create-coupon',
		'dynamic-pricing',
		'order-bumps',
		'upsells',
		'cart-recovery',
		'subscriptions',
		'affiliates',
	];

	/**
	 * Get the learn progress for the current user.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return array
	 */
	public function index( \WP_REST_Request $request ) {
		$progress = get_user_meta( get_current_user_id(), $this->meta_key, true );

		return [
			'completed_steps' => ! empty( $progress ) ? (array) $progress : [],
		];
	}

	/**
	 * Update the learn progress for the current user.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return array|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		$completed_steps = $request->get_param( 'completed_steps' );

		if ( ! is_array( $completed_steps ) ) {
			return new \WP_Error( 'invalid_data', __( 'Invalid data format.', 'surecart' ), [ 'status' => 400 ] );
		}

		// Sanitize step IDs and filter to only valid ones.
		$completed_steps = array_map( 'sanitize_text_field', $completed_steps );
		$completed_steps = array_values( array_intersect( $completed_steps, self::VALID_STEP_IDS ) );

		update_user_meta( get_current_user_id(), $this->meta_key, $completed_steps );

		return [
			'completed_steps' => $completed_steps,
		];
	}
}
