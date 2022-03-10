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
	 * @param \CheckoutEngine\Models\User $user User model.
	 * @param array                       $args {
	 *                        Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @return boolean Does user have permission.
	 */
	public function edit_ce_order( $user, $args ) {
		$order = Order::find( $args[2] );
		if ( ! $order || is_wp_error( $order ) ) {
			return false;
		}
		return in_array( $order->status, [ 'draft', 'finalized' ] );
	}

	/**
	 * Can user edit subscription.
	 *
	 * @param \CheckoutEngine\Models\User $user User model.
	 * @param array                       $args {
	 *                        Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @return boolean Does user have permission.
	 */
	public function read_ce_order( $user, $args ) {
		$order = Order::find( $args[2] );
		if ( in_array( $order->status, [ 'draft', 'finalized' ] ) ) {
			return true;
		}
		return $this->belongsToUser( Order::class, $args[2], $user );
	}
}
