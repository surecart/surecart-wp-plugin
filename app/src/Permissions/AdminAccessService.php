<?php

namespace SureCart\Permissions;

/**
 * Admin Access Service
 */
class AdminAccessService {

    /**
	 * Admin access service construct
	 *
	 * @return void
	 */
    public function bootstrap() {
		add_action( 'admin_init', [ $this, 'prevent_admin_access' ] );
	}

	/**
	 * Prevent admin access
	 *
	 * @return void
	 */
	public function prevent_admin_access() {
		$prevent_access = false;

		if (
            ! wp_doing_ajax() &&
            isset( $_SERVER['SCRIPT_FILENAME'] ) &&
            basename( sanitize_text_field( wp_unslash( $_SERVER['SCRIPT_FILENAME'] ) ) ) !== 'admin-post.php'
        ) {
            if ( current_user_can( 'sc_customer' ) && ! current_user_can( 'edit_posts' ) ) {
                $prevent_access = true;
            }
		}

		if ( $prevent_access ) {
			wp_safe_redirect( \SureCart::pages()->url( 'dashboard' ) );
			exit;
		}
	}
}
