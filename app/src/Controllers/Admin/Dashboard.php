<?php

namespace SureCart\Controllers\Admin;

class Dashboard {
	public function show( $request, $view ) {
		return \SureCart::view( 'admin.dashboard' );
	}
}
