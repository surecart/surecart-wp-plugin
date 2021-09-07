<?php

namespace CheckoutEngine\Controllers\Admin;

class Onboarding {
	public function show( \WPEmerge\Requests\RequestInterface $request, $view ) {
		return \CheckoutEngine::view( 'admin.onboarding.show' );
	}
}
