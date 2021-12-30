<?php

namespace CheckoutEngine\Permissions;

use CheckoutEngine\Models\Charge;
use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\User;
use CheckoutEngine\Permissions\RolesService;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the request service
 */
class RolesServiceProvider implements ServiceProviderInterface {

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['checkout_engine.permissions.roles'] = function () {
			return new RolesService();
		};

		$container['checkout_engine.permissions.permissions'] = function () {
			return new PermissionsService();
		};

		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		// register_setting alias.
		$app->alias(
			'createRoles',
			function () use ( $container ) {
				return call_user_func_array( [ $container['checkout_engine.permissions.roles'], 'createRoles' ], func_get_args() );
			}
		);

		$container['checkout_engine.permissions.permissions']->register();
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 *
	 * @return void
	 *
	 * phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter
	 */
	public function bootstrap( $container ) {
	}

	/**
	 * Meta caps for models
	 *
	 * @param array  $caps Primitive capabilities required of the user.
	 * @param string $cap     Capability being checked.
	 * @param int    $user_id User ID.
	 * @param mixed  $args Optional further parameters, typically starting with an object ID.
	 * @return string[] Primitive capabilities required of the user.
	 */
	public function metaCaps( $caps, $cap, $user_id, $args ) {
		switch ( $cap ) {
			// case 'edit_pk_subscription':
			// need a customer id.
			// $customer_id = User::find( $user_id )->customerId();

			// if ( ! $customer_id ) {
			// $caps[] = 'do_not_allow';
			// break;
			// }

			// need a subscription.
			// $subscription = Subscription::find( $args[0] );
			// if ( ! $subscription ) {
			// $caps[] = 'do_not_allow';
			// break;
			// }

			// needs to match.
			// if ( $subscription->customer !== $customer_id ) {
			// $caps[] = 'do_not_allow';
			// break;
			// }

			// $caps[] = 'edit_pk_subscriptions';
			// break;
			// // TODO: Add more meta caps.
			case 'read_pk_subscription':
				$subscription = Subscription::find( $args[0] );
				if ( ! $subscription ) {
					$caps[] = 'do_not_allow';
					break;
				}
				// check if user is the owner of the subscription.
				// by checking the customer id against current user.
				break;

				// TODO: Add more meta caps.
			case 'read_pk_charge':
				$charge = Charge::find( $args[0] );
				if ( ! $charge ) {
					$caps[] = 'do_not_allow';
					break;
				}
				// check if user is the owner of the subscription.
				// by checking the customer id against current user.
				break;
		}

		return $caps;
	}
}
