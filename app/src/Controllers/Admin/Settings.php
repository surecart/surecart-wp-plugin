<?php

namespace CheckoutEngine\Controllers\Admin;

class Settings {
	public function show( $request, $view ) {
		return \CheckoutEngine::view( 'admin.settings' );
	}
}
