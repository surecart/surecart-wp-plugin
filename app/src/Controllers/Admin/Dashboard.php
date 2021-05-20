<?php

namespace CheckoutEngine\Controllers\Admin;

class Dashboard {
	public function show( $request, $view ) {
        return \CheckoutEngine::view( 'dashboard' );
    }
}
