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
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 * @return boolean Does user have permission.
	 */
	public function edit_sc_customer( $user, $args, $allcaps ) {
		if ( $allcaps['edit_sc_customers'] ) {
			return true;
		}
		// no data provided to update. Make sure to at least pass an empty array.
		if ( is_null( $args[3] ) ) {
			return false;
		}

		$params = $args[3];

		// request has blacklisted keys.
		if ( ! $this->requestOnlyHasKeys( $params, [ 'cancel_at_period_end', 'quantity', 'price', 'purge_pending_update' ] ) ) {
			return false;
		}

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
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 * @return boolean Does user have permission.
	 */
	public function read_sc_customer( $user, $args, $allcaps ) {
		if ( $allcaps['read_sc_customers'] ) {
			return true;
		}
		return $this->customerIdMatches( $user, $args[2] );
	}

	/**
	 * Can user list.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type string[]  ...$2 The ids to list.
	 * }
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 *
	 * @return boolean Does user have permission.
	 */
	public function read_sc_customers( $user, $args, $allcaps ) {
		if ( $allcaps['read_sc_customers'] ) {
			return true;
		}
		return $this->isListingOwnCustomerIds( $user, $args[2]['ids'] ?? [] );
	}

	/**
	 * Does the customer id match the user id.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param string                $id Customer ID.
	 * @return boolean
	 */
	public function customerIdMatches( $user, $id ) {
		return in_array( $id, (array) $user->customerIds(), true );
	}
}
