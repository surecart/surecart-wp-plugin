<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Models\Account;

class Settings {
	public function show( \CheckoutEngineCore\Requests\RequestInterface $request, $view ) {
		return \CheckoutEngine::view( 'admin/settings' );
	}
}
