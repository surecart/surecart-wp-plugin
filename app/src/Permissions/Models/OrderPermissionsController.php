<?php
namespace CheckoutEngine\Permissions\Models;

use CheckoutEngine\Models\Order;

/**
 * Handle various charge permissions.
 */
class OrderPermissionsController extends ModelPermissionsController {
	/**
	 * Can user edit charge.
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
	public function edit_ce_order( $customer_id, $args ) {
		$session = Order::find( $args[2] );
		return in_array( $session->status, [ 'draft', 'finalized' ] );
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
	public function read_ce_order( $customer_id, $args ) {
		$session = Order::find( $args[2] );
		if ( in_array( $session->status, [ 'draft', 'finalized' ] ) ) {
			return true;
		}
		// allow if charge customer matches customer id.
		return ( $session->customer ?? null ) === $customer_id;
	}
}
