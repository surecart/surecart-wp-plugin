<?php

namespace CheckoutEngine\Controllers\Admin\UpgradePaths;

/**
 * Handles product admin requests.
 */
class UpgradePathsController {
	/**
	 * Coupons edit.
	 */
	public function edit() {
		return \CheckoutEngine::view( 'admin/upgrade-paths/edit' );
	}
}
