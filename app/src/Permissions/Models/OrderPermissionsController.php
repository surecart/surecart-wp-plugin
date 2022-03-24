<?php
namespace SureCart\Permissions\Models;

use SureCart\Models\Order;

/**
 * Handle various charge permissions.
 */
class OrderPermissionsController extends ModelPermissionsController {
	/**
	 * Can user edit charge.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 * @return boolean Does user have permission.
	 */
	public function edit_sc_order( $user, $args, $allcaps ) {
		if ( $allcaps['edit_sc_orders'] ) {
			return true;
		}
		$order = Order::find( $args[2] );
		if ( ! $order || is_wp_error( $order ) ) {
			return false;
		}
		return in_array( $order->status, [ 'draft', 'finalized' ] );
	}

	/**
	 * Can user read.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 * @return boolean Does user have permission.
	 */
	public function read_sc_order( $user, $args, $allcaps ) {
		if ( $allcaps['read_sc_orders'] ) {
			return true;
		}
		$order = Order::find( $args[2] );
		if ( in_array( $order->status, [ 'draft', 'finalized' ] ) ) {
			return true;
		}
		return $this->belongsToUser( Order::class, $args[2], $user );
	}
}
