<?php

namespace SureCart\Integrations\AffiliateWP;

/**
 * Controls the LearnDash integration.
 */
class AffiliateWPService {
	/**
	 * Bootstrap the integration.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'affwp_extended_integrations', [ $this, 'register' ] );
	}

	/**
	 * Register the integration
	 *
	 * @param array $integrations Integrations.
	 *
	 * @return array
	 */
	public function register( $integrations ) {
		$integrations['surecart'] = [
			'name'     => __( 'SureCart', 'surecart' ),
			'class'    => 'Custom_Integration',
			'file'     => 'path/to/integration/Custom_Integration.php',
			'enabled'  => true,
			'supports' => [ 'sales_reporting', 'manual_coupons', 'dynamic_coupons' ], // Only enable sales reporting if your plugin will actually support sales data methods in the base class!
		];
		return $integrations;
	}
}
