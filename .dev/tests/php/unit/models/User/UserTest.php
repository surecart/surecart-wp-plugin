<?php

namespace SureCart\Tests\Models;

use SureCart\Models\User;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class UserTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_getsCurrentUser()
	{
		$user = $this->factory->user->create_and_get();
		$user_2 = $this->factory->user->create_and_get();
		wp_set_current_user($user->ID);

		$model = User::current();
		$this->assertEquals($user->ID, $model->ID);
		$this->assertEquals($user->user_email, $model->user_email);

		$model_2 = User::find($user_2->ID);
		$this->assertEquals($user_2->ID, $model_2->ID);
		$this->assertNotEmpty($model_2->user_email);
		$this->assertEquals($user_2->user_email, $model_2->user_email);
	}

	public function test_findByCustomerId() {
		$user_id = $this->factory->user->create();
		$user_id_2 = $this->factory->user->create();
		// up
		$model = User::find($user_id);
		$model->setCustomerId('liveid', 'live');

		$model_2 = User::find($user_id_2);
		$model_2->setCustomerId('testid', 'test');

		$this->assertSame($user_id, User::findByCustomerId('liveid')->ID);
		$this->assertSame($user_id_2, User::findByCustomerId('testid')->ID);
	}

	public function test_setCustomerId() {
		$user_id = $this->factory->user->create();

		$model = User::find($user_id);
		$model->setCustomerId('liveid', 'live');
		$model->setCustomerId('test', 'test');

		$this->assertWPError($model->setCustomerId('somethingelse', 'live'));
		$this->assertWPError($model->setCustomerId('somethingelse', 'test'));

		$this->assertNotWPError($model->setCustomerId('somethingelse', 'live', true));
		$this->assertNotWPError($model->setCustomerId('somethingelse', 'test', true));
	}

	public function test_creating_a_user_without_an_username_uses_email() {
		$user = User::create([
			'user_email' => 'testemail@email.com'
		]);
		$this->assertSame('testemail@email.com', $user->user_login);

		$user = User::create([
			'user_name' => null,
			'user_email' => 'testemail2@email.com'
		]);
		$this->assertSame('testemail2@email.com', $user->user_login);
	}

	/**
	 * Append number to existing username.
	 */
	public function test_creating_a_user_with_an_existing_username_appends_numbers() {
		$user = User::create([
			'user_name' => 'person',
			'user_email' => 'testemail@email.com'
		]);
		$user1 = User::create([
			'user_name' => 'person',
			'user_email' => 'testemail1@email.com'
		]);
		$user2 = User::create([
			'user_name' => 'person',
			'user_email' => 'testemail2@email.com'
		]);
		$user_special = User::create([
			'user_name' => 'הדר',
			'user_email' => 'specialemail@email.com'
		]);

		$this->assertSame($user->user_login, 'person');
		$this->assertSame($user1->user_login, 'person1');
		$this->assertSame($user2->user_login, 'person2');
		$this->assertSame($user_special->user_login, 'specialemail@email.com');
	}

	/**
	 * Sets first and last name
	 */
	public function test_creating_a_user_also_sets_firstname_lastname() {
		$user = User::create([
			'user_name' => 'person',
			'user_email' => 'testemail@email.com',
			'first_name' => 'Andre',
			'last_name' => 'Gagnon'
		]);

		$this->assertSame($user->first_name, 'Andre');
		$this->assertSame($user->last_name, 'Gagnon');
	}

	public function test_syncsCustomerIds()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$user = self::factory()->user->create_and_get([
			'user_email' => 'test@test.com',
		]);

		$user = User::find($user->ID);

		// default should be empty
		$customer_ids = $user->syncCustomerIds();
		$this->assertEmpty($customer_ids);

		// turn on syncing.
		update_option('surecart_auto_sync_user_to_customer', true);

		$requests->shouldReceive('makeRequest')
		->once()
		->andReturn((object)['data' => [
			(object) [
				'id' => 'testCustomerId',
				'object' => 'customer',
				'live_mode' => false,
				'email' => 'test@test.com'
			],
			(object) [
				'id' => 'liveCustomerId',
				'object' => 'customer',
				'live_mode' => true,
				'email' => 'test@test.com'
			]
		]]);

		$customer_id = $user->syncCustomerIds();
		$this->assertSame($customer_id['test'], 'testCustomerId');
		$this->assertSame($customer_id['live'], 'liveCustomerId');
	}
}
