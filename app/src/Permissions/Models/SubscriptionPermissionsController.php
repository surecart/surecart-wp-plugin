<?php
namespace SureCart\Permissions\Models;

use SureCart\Models\Subscription;

/**
 * Handle various permissions.
 */
class SubscriptionPermissionsController extends ModelPermissionsController {
	/**
	 * Subscription cancelation.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 The quantity to update.
	 * }
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 *
	 * @return boolean
	 */
	public function cancel_sc_subscription( $user, $args, $allcaps ) {
		if ( $allcaps['edit_sc_subscriptions'] ) {
			return true;
		}

		// It's disabled on the account.
		if ( empty( \SureCart::account()->portal_protocol->subscription_cancellations_enabled ) ) {
			return false;
		}

		return $this->belongsToUser( Subscription::class, $args[2], $user );
	}

	/**
	 * Subscription Update Quantity.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 The quantity to update.
	 * }
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 *
	 * @return boolean
	 */
	public function update_sc_subscription_quantity( $user, $args, $allcaps ) {
		if ( $allcaps['edit_sc_subscriptions'] ) {
			return true;
		}

		$subscription = Subscription::find( $args[2] );

		if ( empty( \SureCart::account()->portal_protocol->subscription_quantity_updates_enabled ) ) {
			$subscription = Subscription::find( $args[2] );
			if ( is_wp_error( $subscription ) ) {
				return false;
			}

			$quantity = $args[3];

			// quantities don't match.
			if ( $subscription->quantity !== $quantity ) {
				return false;
			}
		}

		return $this->belongsToUser( Subscription::class, $args[2], $user );
	}

	/**
	 * Subscription Switch.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type mixed  ...$2 The quantity to update.
	 * }
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 * @return boolean
	 */
	public function switch_sc_subscription( $user, $args, $allcaps ) {
		if ( $allcaps['edit_sc_subscriptions'] ) {
			return true;
		}

		if ( empty( $args[2] ) ) {
			return false;
		}

		// It's disabled on the account.
		if ( empty( \SureCart::account()->portal_protocol->subscription_updates_enabled ) ) {
			return false;
		}

		return $this->belongsToUser( Subscription::class, $args[2], $user );
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
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 *
	 * @return boolean Does user have permission.
	 */
	public function read_sc_subscription( $user, $args, $allcaps ) {
		if ( $allcaps['read_sc_subscriptions'] ) {
			return true;
		}
		return $this->belongsToUser( Subscription::class, $args[2], $user );
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
	public function read_sc_subscriptions( $user, $args, $allcaps ) {
		if ( $allcaps['read_sc_subscriptions'] ) {
			return true;
		}

		if ( empty( $args[2] ) ) {
			return false;
		}

		// check to make sure they are not trying to list an ID that's not one of their own.
		$customer_ids = $args[2];
		foreach ( $customer_ids as $id ) {
			if ( ! $id || ! in_array( $id, (array) $user->customerIds() ) ) {
				return false; // this id does not belong to the user.
			}
		}

		return true;
	}

	/**
	 * Can user edit.
	 *
	 * @param \SureCart\Models\User $user User model.
	 * @param array                 $args {
	 *                  Arguments that accompany the requested capability check.
	 *     @type string    $0 Requested capability.
	 *     @type int       $1 Concerned user ID.
	 *     @type string    $2 The id of the subscription.
	 *     @type array  ...$4 The data that is being requested to update.
	 * }
	 * @param bool[]                $allcaps Array of key/value pairs where keys represent a capability name
	 *                                       and boolean values represent whether the user has that capability.
	 * @return boolean Does user have permission.
	 */
	public function edit_sc_subscription( $user, $args, $allcaps ) {
		if ( $allcaps['edit_sc_subscriptions'] ) {
			return true;
		}

		// no data provided to update. Make sure to at least pass an empty array.
		if ( is_null( $args[3] ) ) {
			return false;
		}

		// these keys are the only ones that we want to be able to update.
		if ( $this->requestOnlyHasKeys( [ 'cancel_at_period_end', 'quantity', 'price', 'purge_pending_update' ], $args[3] ) ) {
			return $this->belongsToUser( Subscription::class, $args[2], $user );
		}

		return false;
	}
}
