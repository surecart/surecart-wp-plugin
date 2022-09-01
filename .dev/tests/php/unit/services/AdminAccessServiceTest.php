<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Permissions\AdminAccessService;

class AdminAccessServiceTest extends SureCartUnitTestCase {

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
	 * @group failing
	 */
	public function test_sc_customers_redirect_from_admin() {
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
		wp_set_current_user( $user_id );
		$this->assertFalse($this->service->canAccessAdmin());
	}

	/**
	 * They can access if doing ajax request (admin-ajax.php)
	 * @group failing
	 */
	public function test_sc_customers_do_not_redirect_if_doing_ajax() {
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
		wp_set_current_user( $user_id );
		define('DOING_AJAX', true);
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * They can access if admin-post.php
	 * @group failing
	 */
	public function test_sc_customers_do_not_redirect_if_admin_post() {
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
	 * @group failing
	 */
	public function test_sc_customers_do_not_redirect_if_can_edit_posts() {
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
		wp_set_current_user( $user_id );
		// but they could if they have edit_posts permissions.
		$user = get_user_by('ID', $user_id);
		$user->add_cap( 'edit_posts');
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * Subscribers do not redirect
	 * @group failing
	 */
	public function test_subscribers_do_not_redirect() {
		// customers can access.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		wp_set_current_user( $user_id );
		$this->assertTrue($this->service->canAccessAdmin());
	}

	/**
	 * Subscribers do not redirect
	 * @group failing
	 */
	public function test_administrators_do_not_redirect() {
		// customers can access.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $user_id );
		$this->assertTrue($this->service->canAccessAdmin());
	}
}
