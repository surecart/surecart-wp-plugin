<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\PluginInstallerController;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class PluginInstallerControllerTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Support\Errors\ErrorsServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
				],
			],
			false
		);

		parent::setUp();
	}

	/**
	 * A missing or zero id returns a 400 WP_Error without touching the catalog.
	 *
	 * @group plugin-installer
	 */
	public function test_install_requires_valid_id() {
		$controller = new PluginInstallerController();
		$request    = new WP_REST_Request( 'POST', '/surecart/v1/integration_plugin_install' );

		$result = $controller->install( $request );

		$this->assertWPError( $result );
		$this->assertSame( 'sc_invalid_request', $result->get_error_code() );
		$this->assertSame( 400, $result->get_error_data()['status'] );
	}

	/**
	 * DISALLOW_FILE_MODS short-circuits with a 403 before any install runs.
	 *
	 * Runs in a separate process so the defined constant does not leak into
	 * other tests in the suite.
	 *
	 * @group plugin-installer
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_install_blocked_when_file_mods_disabled() {
		define( 'DISALLOW_FILE_MODS', true );

		$controller = new PluginInstallerController();
		$request    = new WP_REST_Request( 'POST', '/surecart/v1/integration_plugin_install' );
		$request->set_param( 'id', 123 );

		$result = $controller->install( $request );

		$this->assertWPError( $result );
		$this->assertSame( 'sc_file_mods_disabled', $result->get_error_code() );
		$this->assertSame( 403, $result->get_error_data()['status'] );
	}
}
