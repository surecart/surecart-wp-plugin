<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Controllers\Rest\CustomerController;
use SureCart\Models\User;
use WP_REST_Request;

class CustomerControllerTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		parent::setUp();
	}

	/**
	 * Mock the platform request service with a canned response.
	 *
	 * @param mixed $response Response the platform request returns.
	 */
	protected function mockPlatformResponse( $response ) {
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('customers/testcustomerid')
			->andReturn($response);
	}

	/**
	 * Build a PATCH request for the test customer.
	 *
	 * @param array $body Body params.
	 *
	 * @return WP_REST_Request
	 */
	protected function editRequest( $body ) {
		$request = new WP_REST_Request('PATCH', '/surecart/v1/customers');
		$request->set_body_params($body);
		$request->set_url_params([
			'id' => 'testcustomerid'
		]);
		return $request;
	}

	/**
	 * Names sync from the platform response, but the login email never does —
	 * flipping user_email is the account takeover primitive (CVE-2026-7655).
	 *
	 * @group users
	 * @group customers
	 * @group rest-authz-hardening
	 */
	public function test_update_changes_wp_name_but_not_email() {
		$this->mockPlatformResponse((object)[
			'id' => 'testcustomerid',
			'email' => 'testemail@test.com',
			'first_name' => 'testfirstname',
			'last_name' => 'testlastname'
		]);

		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');
		$original_email = $user->user_email;

		// the customer is editing their own profile.
		wp_set_current_user($user->ID);

		$controller = \Mockery::mock(CustomerController::class)->makePartial();
		$controller->edit($this->editRequest([
			'email' => 'testemail@test.com',
			'first_name' => 'testfirstname',
			'last_name' => 'testlastname'
		]));

		$updated = get_user_by('ID', $user->ID);
		$this->assertSame($original_email, $updated->user_email);
		$this->assertSame('testfirstname', $updated->first_name);
		$this->assertSame('testlastname', $updated->last_name);
	}

	/**
	 * Even a caller allowed to edit customers must not be able to change
	 * another user's login email through this endpoint.
	 *
	 * @group users
	 * @group customers
	 * @group rest-authz-hardening
	 */
	public function test_edit_does_not_update_email_of_another_user() {
		$this->mockPlatformResponse((object)[
			'id' => 'testcustomerid',
			'email' => 'attacker@evil.test',
			'first_name' => 'newfirstname'
		]);

		$caller = self::factory()->user->create(['role' => 'administrator']);
		get_user_by('ID', $caller)->add_cap('edit_sc_customers');
		wp_set_current_user($caller);

		$target = self::factory()->user->create(['user_email' => 'owner@example.test']);
		// write meta directly so this user resolves for the customer id.
		update_user_meta($target, 'sc_customer_ids', ['live' => 'testcustomerid']);

		$controller = \Mockery::mock(CustomerController::class)->makePartial();
		$controller->edit($this->editRequest([
			'email' => 'attacker@evil.test',
			'first_name' => 'newfirstname'
		]));

		$updated = get_user_by('ID', $target);
		// the name sync ran, proving the write path executed.
		$this->assertSame('newfirstname', $updated->first_name);
		// but the email is never written locally.
		$this->assertSame('owner@example.test', $updated->user_email);
	}

	/**
	 * The platform is the source of truth — a failed platform update must
	 * leave the local WordPress user untouched.
	 *
	 * @group users
	 * @group customers
	 * @group rest-authz-hardening
	 */
	public function test_edit_does_not_touch_wp_user_when_platform_update_fails() {
		$this->mockPlatformResponse(new \WP_Error('platform_error', 'Something went wrong.'));

		$user = User::find(self::factory()->user->create([
			'first_name' => 'originalfirst',
			'last_name' => 'originallast'
		]));
		$user->setCustomerId('testcustomerid');
		wp_set_current_user($user->ID);

		$controller = \Mockery::mock(CustomerController::class)->makePartial();
		$response = $controller->edit($this->editRequest([
			'first_name' => 'newfirstname',
			'last_name' => 'newlastname'
		]));

		$this->assertWPError($response);

		$updated = get_user_by('ID', $user->ID);
		$this->assertSame('originalfirst', $updated->first_name);
		$this->assertSame('originallast', $updated->last_name);
	}

	/**
	 * A non-admin caller must never mutate a WordPress user other than
	 * themselves, regardless of what the permission callback concluded.
	 *
	 * @group users
	 * @group customers
	 * @group rest-authz-hardening
	 */
	public function test_edit_refuses_when_resolved_user_is_not_the_caller() {
		$this->mockPlatformResponse((object)[
			'id' => 'testcustomerid',
			'first_name' => 'newfirstname'
		]);

		$caller = self::factory()->user->create(['role' => 'subscriber']);
		wp_set_current_user($caller);

		$target = self::factory()->user->create([
			'user_email' => 'owner@example.test',
			'first_name' => 'originalfirst'
		]);
		update_user_meta($target, 'sc_customer_ids', ['live' => 'testcustomerid']);

		$controller = \Mockery::mock(CustomerController::class)->makePartial();
		$controller->edit($this->editRequest([
			'first_name' => 'newfirstname'
		]));

		$updated = get_user_by('ID', $target);
		$this->assertSame('originalfirst', $updated->first_name);
		$this->assertSame('owner@example.test', $updated->user_email);
	}
}
