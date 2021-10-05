<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Models\Account;

class Settings {
	public function show( \WPEmerge\Requests\RequestInterface $request, $view ) {
		var_dump( Account::find() );
		return \CheckoutEngine::view( 'admin.settings' );
	}
}
