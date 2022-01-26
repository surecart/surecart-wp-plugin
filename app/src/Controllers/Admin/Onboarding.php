<?php

namespace CheckoutEngine\Controllers\Admin;

class Onboarding {
	public function show( \CheckoutEngineCore\Requests\RequestInterface $request, $view ) {
		$action = isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : 'action';

		// compelte the signup.
		if ( 'complete_signup' === $action ) {
			return \CheckoutEngine::view( 'admin/onboarding/show' );
		}

		// redirect to signup.
		wp_redirect( untrailingslashit( CHECKOUT_ENGINE_APP_URL ) . '/sign_up?return_url=' . esc_url( add_query_arg( [ 'action' => 'complete_signup' ], get_home_url( null, '/wp-admin/admin.php?page=ce-getting-started' ) ) ) );
		exit;
	}
}
