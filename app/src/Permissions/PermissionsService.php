<?php

namespace CheckoutEngine\Permissions;

use CheckoutEngine\Permissions\Models\ChargePermissionsController;
use CheckoutEngine\Permissions\Models\SubscriptionPermissionsController;

/**
 * Permissions Service
 */
class PermissionsService {
	/**
	 * What controllers to use for what permissions
	 *
	 * @var array
	 */
	protected $controllers = [
		SubscriptionPermissionsController::class,
		ChargePermissionsController::class,
	];

	/**
	 * Register controller permission handlers
	 *
	 * @return void
	 */
	public function register() {
		foreach ( $this->controllers as $controller ) {
			$instance = new $controller();
			add_filter( 'user_has_cap', [ $instance, 'handle' ], 10, 4 );
		}
	}
}
