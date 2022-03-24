<?php
namespace SureCart\Permissions\Models;

use SureCart\Models\Charge;

/**
 * Handle various charge permissions.
 */
class ChargePermissionsController extends ModelPermissionsController {
	/**
	 * Can user read
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @return boolean Does user have permission.
	 */
	public function read_sc_charge( $user, $args ) {
		return $this->belongsToUser( Charge::class, $args[2], $user );
	}
}
