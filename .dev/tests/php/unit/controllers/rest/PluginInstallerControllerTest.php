<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\PluginInstallerController;
use SureCart\Rest\PluginInstallerRestServiceProvider;
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

	/**
	 * A user without install_plugins gets a 403 WP_Error from the permission check.
	 *
	 * @group plugin-installer
	 */
	public function test_install_permission_check_denies_user_without_cap() {
		$user_id = self::factory()->user->create( [ 'role' => 'subscriber' ] );
		wp_set_current_user( $user_id );

		$provider = new PluginInstallerRestServiceProvider();
		$request  = new WP_REST_Request( 'POST', '/surecart/v1/integration_plugin_install' );

		$result = $provider->install_permission_check( $request );

		$this->assertWPError( $result );
		$this->assertSame( 'sc_insufficient_permissions', $result->get_error_code() );
		$this->assertSame( 403, $result->get_error_data()['status'] );
	}

	/**
	 * A user with install_plugins passes the permission check.
	 *
	 * @group plugin-installer
	 */
	public function test_install_permission_check_allows_capable_user() {
		$user_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $user_id );

		$provider = new PluginInstallerRestServiceProvider();
		$request  = new WP_REST_Request( 'POST', '/surecart/v1/integration_plugin_install' );

		$this->assertTrue( $provider->install_permission_check( $request ) );
	}
}
