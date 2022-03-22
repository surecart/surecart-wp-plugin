<?php
namespace SureCart\Permissions\Models;

/**
 * Handle permissions.
 */
class CustomerPermissionsController extends ModelPermissionsController {
	/**
	 * Can user edit
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
	public function edit_ce_customer( $user, $args ) {
		return $this->customerIdMatches( $user, $args[2] );
	}

	/**
	 * Can user read
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
	public function read_ce_customer( $user, $args ) {
		return $this->customerIdMatches( $user, $args[2] );
	}

	/**
	 * Does the customer id match the user id.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param string                $id Customer ID.
	 * @return boolean
	 */
	public function customerIdMatches( $user, $id ) {
		return ( $user->customerId() ?? null ) === $id;
	}
}
