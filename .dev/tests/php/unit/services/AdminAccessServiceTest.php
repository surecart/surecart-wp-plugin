<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Permissions\AdminAccessService;

class AdminAccessServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Pages\PageServiceProvider::class,
			]
		], false);

		$this->service = new AdminAccessService();

		parent::setUp();
	}

	/**
	 * They are redirected from admin.
	 */
	public function test_sc_customers_cannot_access_admin() {
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
		wp_set_current_user( $user_id );
		$this->assertFalse($this->service->canAccessAdmin());
	}

	/**
	 * They can access if doing ajax request (admin-ajax.php)
	 */
	public function test_sc_customers_can_access_admin_if_doing_ajax() {
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
		wp_set_current_user( $user_id );
		define('DOING_AJAX', true);
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * They can access if admin-post.php
	 */
	public function test_sc_customers_can_access_admin_if_admin_post() {
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
		wp_set_current_user( $user_id );
		// they can access if the script SCRIPT_FILENAME constant is not set.
		unset($_SERVER['SCRIPT_FILENAME']);
		$this->assertTrue($this->service->canAccessAdmin());

		// they can access if the SCRIPT_FILENAME is admin-post.php
		$_SERVER['SCRIPT_FILENAME'] = 'admin-post.php';
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * They can access if they can edit posts
	 */
	public function test_sc_customers_can_access_admin_if_can_edit_posts() {
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
		wp_set_current_user( $user_id );
		// but they could if they have edit_posts permissions.
		$user = get_user_by('ID', $user_id);
		$user->add_cap( 'edit_posts');
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * Subscribers do not redirect
	 */
	public function test_subscribers_can_access_admin() {
		// customers can access.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		wp_set_current_user( $user_id );
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * Administrators do not redirect
	 */
	public function test_administrators_can_access_admin() {
		// customers can access.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $user_id );
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * Redirect happens if cannot access admin.
	 */
	public function test_redirect_happens_if_cannot_access_admin() {
		$service = \Mockery::mock( AdminAccessService::class )->makePartial();
		// if cannot access admin.
		$service->shouldReceive('canAccessAdmin')->once()->andReturn(false);
		// should redirect.
		$service->shouldReceive('redirectToAdmin')->once()->andReturn(null);
		// call function
		$service->handleAdminAccess();
	}

	/**
	 * Redirect happens if can access admin.
	 */
	public function test_redirect_does_not_happen_if_can_access_admin() {
		$service = \Mockery::mock( AdminAccessService::class )->makePartial();
		// if cannot access admin.
		$service->shouldReceive('canAccessAdmin')->once()->andReturn(true);
		// should redirect.
		$service->shouldReceive('redirectToAdmin')->never();
		// call function
		$service->handleAdminAccess();
	}
}
