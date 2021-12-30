<?php

namespace CheckoutEngine\Permissions\Models;

use CheckoutEngine\Models\User;

/**
 * Model permissions abstract class.
 */
abstract class ModelPermissionsController {
	/**
	 * Get the customer id for the user
	 *
	 * @param int $user_id User ID.
	 * @return string Customer ID.
	 */
	protected function getCustomerId( $user_id ) {
		return User::find( $user_id )->customerId();
	}

	/**
	 * Meta caps for models
	 *
	 * @param bool[]   $allcaps Array of key/value pairs where keys represent a capability name
	 *                          and boolean values represent whether the user has that capability.
	 * @param string[] $caps    Required primitive capabilities for the requested capability.
	 * @param array    $args {
	 *     Arguments that accompany the requested capability check.
	 *
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 Optional second and further parameters, typically object ID.
	 * }
	 * @param WP_User  $user    The user object.
	 * @return string[] Primitive capabilities required of the user.
	 */
	public function handle( $allcaps, $caps, $args, $user ) {
		$name = $caps[0];
		if ( method_exists( $this, $name ) ) {
			// we need a customer id first.
			$customer_id = $this->getCustomerId( $user->ID );
			if ( ! $customer_id ) {
				return false;
			}

			// check permission.
			$permission = $this->$name( $customer_id, $args );
			if ( $permission ) {
				$allcaps[ $caps[0] ] = true;
				return $allcaps;
			}
		}

		return $allcaps;
	}
}
