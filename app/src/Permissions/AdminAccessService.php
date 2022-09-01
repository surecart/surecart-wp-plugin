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
		add_action( 'admin_init', [ $this, 'canAccessAdmin' ] );
	}

	/**
	 * Prevent admin access
	 *
	 * @return void
	 */
	public function canAccessAdmin() {
		if (
            wp_doing_ajax() ||
            ! isset( $_SERVER['SCRIPT_FILENAME'] ) ||
            basename( sanitize_text_field( wp_unslash( $_SERVER['SCRIPT_FILENAME'] ) ) ) === 'admin-post.php' ||
			current_user_can( 'edit_posts' )
        ) {
            return false;
		}

		if ( current_user_can( 'sc_customer' ) ) {
			wp_safe_redirect( \SureCart::pages()->url( 'dashboard' ) );
			exit;
		}
	}
}
