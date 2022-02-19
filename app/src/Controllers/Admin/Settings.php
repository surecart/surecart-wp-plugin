<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Models\Account;
use CheckoutEngine\Models\AccountPortalSession;

class Settings {
	public function show( \CheckoutEngineCore\Requests\RequestInterface $request, $view ) {
		$session = AccountPortalSession::create();
		return \CheckoutEngine::view( 'admin/settings' )->with(
			[
				'session_url' => $session->url,
			]
		);
	}
}
