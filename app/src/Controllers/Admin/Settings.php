<?php

namespace CheckoutEngine\Controllers\Admin;

class Settings {
	public function show( \WPEmerge\Requests\RequestInterface $request, $view ) {
		return \CheckoutEngine::view( 'admin.settings')->with([ 
			'tab' => $request->query('tab') 
		]);
	}
}
