<?php
namespace SureCart\Permissions\Models;

use SureCart\Models\Subscription;

/**
 * Handle various permissions.
 */
class SubscriptionPermissionsController extends ModelPermissionsController {
	public function cancel_sc_subscription() {

	}
	public function update_sc_subscription_quantity() {

	}
	public function switch_sc_subscription() {

	}

	/**
	 * Can user read.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @return boolean Does user have permission.
	 */
	public function read_sc_subscription( $user, $args ) {
		return $this->belongsToUser( Subscription::class, $args[2], $user );
	}

	/**
	 * Can user edit.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @return boolean Does user have permission.
	 */
	public function edit_sc_subscription( $user, $args ) {
		return $this->belongsToUser( Subscription::class, $args[2], $user );
	}
}
