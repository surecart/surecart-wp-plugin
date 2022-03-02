<?php
namespace CheckoutEngine\Permissions\Models;

use CheckoutEngine\Models\PaymentMethod;

/**
 * Handle various payment methods permissions.
 */
class PaymentMethodPermissionsController extends ModelPermissionsController {
	/**
	 * Can user read
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
	public function edit_ce_payment_method( $user, $args ) {
		return $this->belongsToUser( PaymentMethod::class, $args[2], $user );
	}
}
