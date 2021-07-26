<?php
namespace CheckoutEngine\Settings;

/**
 * Register setting interface
 */
interface RegisterSettingInterface {
	/**
	 * What to return when settings are indexed.
	 */
	public function index( $settings, $params);

	/**
	 * What to return when settings are updated.
	 */
	public function update( $values = [] );
}
