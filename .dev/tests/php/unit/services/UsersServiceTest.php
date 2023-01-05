<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Users\UsersService;

class UsersServiceTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

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
	 * @group failing
	 */
	public function test_profile_update_syncs_customer_model() {
		$user = User::find(self::factory()->user->create([
			'user_email' => 'testemail@test.com',
			'first_name' => 'firstnametest',
			'last_name' => 'lastnametest'
		]));
		$user->setCustomerId('testcustomerid');

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request./**
		$requests->shouldReceive('makeRequest')
			->once()
			->withArgs([
				'customers/testcustomerid',
				[
					'method' => 'PATCH',
					'body' => [
						'customer' => [
							'first_name' => $user->first_name,
							'last_name' => $user->last_name,
							'email' => $user->user_email
						]
					],
					'query' => []
				],
				false,
				''
			])
			->andReturn((object)[
				'first_name' => $user->first_name,
				'last_name' => $user->last_name,
				'email' => $user->user_email
			]);


		$service = new UsersService();
		$service->syncUserProfile($user->ID, null, [
			'first_name' => $user->first_name,
			'last_name' => $user->last_name,
			'user_email' => $user->user_email
		]);
	}

}
