<?php

namespace SureCart\Permissions;

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
		\SureCart\Permissions\Models\ChargePermissionsController::class,
		\SureCart\Permissions\Models\CustomerPermissionsController::class,
		\SureCart\Permissions\Models\OrderPermissionsController::class,
		\SureCart\Permissions\Models\PaymentMethodPermissionsController::class,
		\SureCart\Permissions\Models\PurchasePermissionsController::class,
		\SureCart\Permissions\Models\RefundPermissionsController::class,
		\SureCart\Permissions\Models\SubscriptionPermissionsController::class,
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
