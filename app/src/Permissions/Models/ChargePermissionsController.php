<?php
namespace CheckoutEngine\Permissions\Models;

use CheckoutEngine\Models\Charge;

/**
 * Handle various charge permissions.
 */
class ChargePermissionsController extends ModelPermissionsController {
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
	public function edit_pk_charge( $customer_id, $args ) {
		// need a subscription.
		$charge = Charge::find( $args[2] );
		// allow if charge customer matches customer id.
		return ( $charge->customer ?? null ) === $customer_id;
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
	public function read_pk_charge( $customer_id, $args ) {
		$charge = Charge::find( $args[2] );
		// allow if charge customer matches customer id.
		return ( $charge->customer ?? null ) === $customer_id;
	}
}
