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
	public function setUp()
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
	 * @group users
	 * @group customers
	 */
	public function test_update_changes_wp_details() {
		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request./**
		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('customers/testcustomerid')
			->andReturn((object)[
				'email' => 'testemail@test.com'
			]);

		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');

		// finalize the order.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/customers');
		$request->set_body_params([
			'email' => 'testemail@test.com',
			'first_name' => 'testfirstname',
			'last_name' => 'testlastname'
		]);
		$request->set_url_params([
			'id' => 'testcustomerid'
		]);

		// mock controller.
		$controller = \Mockery::mock(CustomerController::class)->makePartial();
		$controller->edit($request);

		$updated = get_user_by('ID', $user->ID);
		$this->assertSame($updated->user_email, 'testemail@test.com');
		$this->assertSame($updated->first_name, 'testfirstname');
		$this->assertSame($updated->last_name, 'testlastname');
	}
}
