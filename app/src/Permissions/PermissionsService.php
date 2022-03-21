<?php

namespace SureCart\Permissions;

use SureCart\Permissions\Models\ChargePermissionsController;
use SureCart\Permissions\Models\OrderPermissionsController;
use SureCart\Permissions\Models\PaymentMethodPermissionsController;
use SureCart\Permissions\Models\SubscriptionPermissionsController;

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
