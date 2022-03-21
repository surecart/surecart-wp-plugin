<?php

namespace SureCart\Tests\Models;

use SureCart\Models\Customer;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;

class CustomerTest extends SureCartUnitTestCase
{
	protected $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();

		parent::setUp();
	}

	public function test_creates_user_with_customer()
	{
		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('customers'),
				$this->equalTo([
					'method' => 'POST',
					'body' => [
						"customer" => [
							"email" => "test@test.com",
							"name" => "NewTest"
						]
					],
					'query' => []
				])
			)
			->willReturn((object)[
				"id" => "48ecc3b6-b20c-4ac5-b62e-976ad68cdb85",
				"object" => "customer",
				"email" => "test@test.com",
				"name"=> "NewTest",
			]);

		Customer::create([
			"email" => "test@test.com",
			"name" => "NewTest"
		]);

		// make sure a user is created with this email.
		$user = get_user_by('email', "test@test.com");
		$this->assertNotFalse($user);

		// make sure we can get the user's customer id.
		$this->assertSame(User::find($user->ID)->customerId(), '48ecc3b6-b20c-4ac5-b62e-976ad68cdb85');
	}
}
