<?php
namespace CheckoutEngine\Permissions\Models;

use CheckoutEngine\Models\Subscription;

/**
 * Handle various subscription permissions.
 */
class SubscriptionPermissionsController extends ModelPermissionsController {
	/**
	 * Can user edit subscription.
	 *
	 * @param string $customer_id Customer ID.
	 * @param array  $args {
	 *   Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @return boolean Does user have permission.
	 */
	public function edit_ce_subscription( $customer_id, $args ) {
		// need a subscription.
		$subscription = Subscription::find( $args[2] );
		// allow if subscription customer matches customer id.
		return ( $subscription->customer ?? null ) === $customer_id;
	}

	/**
	 * Can user edit subscription.
	 *
	 * @param string $customer_id Customer ID.
	 * @param array  $args {
	 *   Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @return boolean Does user have permission.
	 */
	public function read_ce_subscription( $customer_id, $args ) {
		$subscription = Subscription::find( $args[2] );
		// allow if subscription customer matches customer id.
		return ( $subscription->customer ?? null ) === $customer_id;
	}
}
