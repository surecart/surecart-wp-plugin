<?php
namespace CheckoutEngine\WordPress\Admin;

class AdminScriptsService {
	public function registerScripts() {
		add_action( 'admin_menu', array( $this, 'registerScripts' ) );
	}

}
