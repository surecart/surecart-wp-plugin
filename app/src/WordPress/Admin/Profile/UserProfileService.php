<?php

namespace SureCart\WordPress\Admin\Profile;

use SureCart\Models\User;

/**
 * Admin user profile service
 */
class UserProfileService {
	/**
	 * Bootstrap related hooks.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'edit_user_profile', [ $this, 'showCustomerInfo' ] );
		add_action( 'show_user_profile', [ $this, 'showCustomerInfo' ] );
	}

	/**
	 * Show customer info on user profile.
	 *
	 * @return function
	 */
	public function showCustomerInfo( $user ) {
		$customer = User::find( $user->ID )->customer();
		$customer = is_wp_error( $customer ) ? false : $customer;
		return $this->render(
			'admin/user-profile',
			[
				'customer'  => $customer,
				'edit_link' => ! empty( $customer->id ) ? \SureCart::getUrl()->edit( 'customer', $customer->id ) : '',
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
		echo wp_kses_post( \SureCart::views()->make( $views )->with( $context )->toString() );
	}
}
