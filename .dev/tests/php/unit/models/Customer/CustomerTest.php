<?php

namespace SureCart\Tests\Models;

use SureCart\Models\Customer;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;

class CustomerTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

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
							"name" => "NewTest",
						]
					],
					'query' => []
				])
			)
			->willReturn((object)[
				"id" => "48ecc3b6-b20c-4ac5-b62e-976ad68cdb85",
				"object" => "customer",
				"email" => "test@test.com",
				"name" => "NewTest",
				"live_mode" => true
			]);

		$created = Customer::create([
			"email" => "test@test.com",
			"name" => "NewTest"
		]);
		$this->assertNotWPError($created);

		// make sure a user is created with this email.
		$user = get_user_by('email', "test@test.com");
		$this->assertNotFalse($user);

		// make sure we can get the user's customer id.
		$this->assertSame(User::find($user->ID)->customerId(), '48ecc3b6-b20c-4ac5-b62e-976ad68cdb85');
	}


	public function test_doesNotCreateUserByDefault()
	{
		$customer = new Customer(['id' => 'test', 'email' => 'test@test.com', 'live_mode' => true]);
		$this->assertEmpty($customer->getUser());
	}

	public function test_createsNewWPUserWithSync() {
		$customer = new Customer(['id' => 'test', 'email' => 'test@test.com', 'live_mode' => true]);
		// turn on syncing.
		update_option('surecart_auto_sync_user_to_customer', true);

		// this should create a new user.
		$user = $customer->getUser();
		$this->assertNotEmpty($user->ID);
		$this->assertSame($user->user_email, 'test@test.com');
		$this->assertSame($user->customerId(), 'test');
	}

	public function test_associatesExistingWPUserWithSync() {
		$user = self::factory()->user->create_and_get(['user_email' => 'test1@test.com']);

		$customer = new Customer(['id' => 'test', 'email' => 'test1@test.com', 'live_mode' => true]);

		// turn on syncing.
		update_option('surecart_auto_sync_user_to_customer', true);

		// this should create a new user.
		$fetched = $customer->getUser();
		$this->assertNotEmpty($fetched->ID);
		$this->assertSame($fetched->ID, $user->ID);
		$this->assertSame($fetched->customerId(), 'test');
	}

	public function test_doesNotAssociatesExistingWPUserWithExistingCustomerId() {
		$user = self::factory()->user->create_and_get(['user_email' => 'test1@test.com']);
		$model = User::find($user->ID);
		$model->setCustomerId('something', 'live');

		$customer = new Customer(['id' => 'test', 'email' => 'test1@test.com', 'live_mode' => true]);

		// turn on syncing.
		update_option('surecart_auto_sync_user_to_customer', true);

		// this should create a new user.
		$fetched = $customer->getUser();
		$this->assertEmpty($fetched);
	}
}
