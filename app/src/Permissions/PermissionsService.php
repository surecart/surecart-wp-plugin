<?php

namespace CheckoutEngine\Permissions;

use CheckoutEngine\Permissions\Models\ChargePermissionsController;
use CheckoutEngine\Permissions\Models\OrderPermissionsController;
use CheckoutEngine\Permissions\Models\PaymentMethodPermissionsController;
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
		OrderPermissionsController::class,
		ChargePermissionsController::class,
		PaymentMethodPermissionsController::class,
	];

	/**
	 * Register controller permission handlers
	 *
	 * @return void
	 */
	public function bootstrap() {
		foreach ( $this->controllers as $controller ) {
			$instance = new $controller();
			add_filter( 'user_has_cap', [ $instance, 'handle' ], 10, 4 );
		}
	}
}
