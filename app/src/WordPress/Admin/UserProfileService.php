<?php

namespace CheckoutEngine\WordPress\Admin;

use CheckoutEngine\Models\User;

/**
 * Admin user profile service
 */
class UserProfileService {
	/**
	 * Register related hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'edit_user_profile', [ $this, 'showCustomerInfo' ] );
		add_action( 'show_user_profile', [ $this, 'showCustomerInfo' ] );
	}

	/**
	 * Show customer info on user profile.
	 *
	 * @return function
	 */
	public function showCustomerInfo() {
		$customer = User::current()->customer();
		$customer = is_wp_error( $customer ) ? false : $customer;
		return $this->render(
			'admin.user-profile',
			[
				'customer'  => $customer,
				'edit_link' => ! empty( $customer->id ) ? \CheckoutEngine::getUrl()->edit( 'customer', $customer->id ) : '',
			]
		);
	}

	/**
	 * Render a block using a template
	 *
	 * @param  string|string[]      $views A view or array of views.
	 * @param  array<string, mixed> $context Context to send.
	 * @return void
	 */
	public function render( $views, $context = [] ) {
		echo wp_kses_post( \CheckoutEngine::views()->make( $views )->with( $context )->toString() );
	}
}
