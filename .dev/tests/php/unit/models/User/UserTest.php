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

	/**
	 * @group user-model
	 */
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

	/**
	 * @group user-model
	 */
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

	/**
	 * @group user-model
	 * @group rest-authz-hardening
	 */
	public function test_findByCustomerId_does_not_match_on_substring() {
		$user_id = $this->factory->user->create();
		User::find($user_id)->setCustomerId('cus_ABCDEF', 'live');

		$this->assertFalse(User::findByCustomerId('cus_ABC'));
	}

	/**
	 * Ambiguity must fail closed — never pick a winner between two users sharing an id.
	 *
	 * @group user-model
	 * @group rest-authz-hardening
	 */
	public function test_findByCustomerId_returns_false_when_two_users_share_an_id() {
		$user_id = $this->factory->user->create();
		$user_id_2 = $this->factory->user->create();

		// write meta directly to simulate pre-existing duplicate data.
		update_user_meta($user_id, 'sc_customer_ids', ['live' => 'cus_shared']);
		update_user_meta($user_id_2, 'sc_customer_ids', ['live' => 'cus_shared']);

		$this->assertFalse(User::findByCustomerId('cus_shared'));
	}

	/**
	 * An id whose value equals a mode key serializes like the key itself,
	 * so the lookup must not resolve via another user's 'test' slot key.
	 *
	 * @group user-model
	 * @group rest-authz-hardening
	 */
	public function test_findByCustomerId_ignores_mode_key_collision() {
		$holder_id = $this->factory->user->create();
		$other_id = $this->factory->user->create();

		// holder's live id is literally the string 'test'.
		update_user_meta($holder_id, 'sc_customer_ids', ['live' => 'test']);
		// another user has an id stored under the 'test' mode key.
		update_user_meta($other_id, 'sc_customer_ids', ['test' => 'cus_other']);

		$this->assertSame($holder_id, User::findByCustomerId('test')->ID);
	}

	/**
	 * @group user-model
	 */
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

	/**
	 * @group user-model
	 * @group rest-authz-hardening
	 */
	public function test_setCustomerId_refuses_id_held_by_another_user() {
		$user_a = $this->factory->user->create();
		$user_b = $this->factory->user->create();

		User::find($user_a)->setCustomerId('cus_x', 'live');

		$result = User::find($user_b)->setCustomerId('cus_x', 'live');
		$this->assertWPError($result);
		$this->assertSame('customer_id_in_use', $result->get_error_code());
		$this->assertEmpty(get_user_meta($user_b, 'sc_customer_ids', true));
	}

	/**
	 * The cross-user check is strictly "held by a different user" —
	 * an id resolving back to the same user must not block the write.
	 *
	 * @group user-model
	 * @group rest-authz-hardening
	 */
	public function test_setCustomerId_allows_reassigning_same_id_to_same_user() {
		$user_id = $this->factory->user->create();

		$model = User::find($user_id);
		$model->setCustomerId('cus_same', 'live');

		// same id into the empty test slot — holder resolves to this same user.
		$this->assertNotWPError($model->setCustomerId('cus_same', 'test'));
	}

	/**
	 * @group user-model
	 * @group rest-authz-hardening
	 */
	public function test_setCustomerId_with_force_overrides_cross_user_check() {
		$user_a = $this->factory->user->create();
		$user_b = $this->factory->user->create();

		User::find($user_a)->setCustomerId('cus_x', 'live');

		$this->assertNotWPError(User::find($user_b)->setCustomerId('cus_x', 'live', true));

		$meta = get_user_meta($user_b, 'sc_customer_ids', true);
		$this->assertSame('cus_x', $meta['live']);
	}

	/**
	 * @group user-model
	 */
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
	 * @group user-model
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
	 * @group user-model
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

	/**
	 * @group user-model
	 */
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

	/**
	 * @group user-model
	 */
	public function test_getOrCreateLiveCustomerIdReturnsExistingCustomerId()
	{
		// Create a user
		$user = self::factory()->user->create_and_get([
			'user_email' => 'test@test.com',
			'display_name' => 'Test User',
		]);

		$model = User::find($user->ID);

		// Set an existing live customer ID
		$model->setCustomerId('existing_live_customer_id', 'live');

		// Get live customer should return the existing ID
		$customer_id = $model->getOrCreateLiveCustomerId();
		$this->assertSame('existing_live_customer_id', $customer_id);
	}

	/**
	 * @group user-model
	 */
	public function test_getOrCreateLiveCustomerIdCreatesNewCustomer()
	{
		// Mock the requests in the container
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without existing customer
		$user = self::factory()->user->create_and_get([
			'user_email' => 'newuser@test.com',
			'display_name' => 'New User',
		]);

		$model = User::find($user->ID);

		// First call: Search for existing customer by email - return empty
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'data' => []
			]);

		// Second call: Create new customer
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'id' => 'new_live_customer_id',
				'object' => 'customer',
				'email' => 'newuser@test.com',
				'name' => 'New User',
				'live_mode' => true,
			]);

		// Get live customer should create a new customer and return the ID
		$customer_id = $model->getOrCreateLiveCustomerId();
		$this->assertSame('new_live_customer_id', $customer_id);

		// Verify the customer ID was set in user meta
		$this->assertSame('new_live_customer_id', $model->customerId('live'));
	}

	/**
	 * @group user-model
	 */
	public function test_getOrCreateLiveCustomerIdReturnsWPErrorOnCustomerCreationFailure()
	{
		// Mock the requests in the container,
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without existing customer.
		$user = self::factory()->user->create_and_get([
			'user_email' => 'error@test.com',
			'display_name' => 'Error User',
		]);

		$model = User::find($user->ID);

		// First call: Search for existing customer by email - return empty
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'data' => []
			]);

		// Second call: Create customer - return WP_Error
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn(new \WP_Error('api_error', 'API request failed'));

		// Get live customer should return WP_Error
		$result = $model->getOrCreateLiveCustomerId();
		$this->assertWPError($result);
		$this->assertSame('api_error', $result->get_error_code());
	}

	/**
	 * @group user-model
	 */
	public function test_getOrCreateLiveCustomerIdReturnsWPErrorWhenNoCustomerIdInResponse()
	{
		// Mock the requests in the container
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without existing customer
		$user = self::factory()->user->create_and_get([
			'user_email' => 'noid@test.com',
			'display_name' => 'No ID User',
		]);

		$model = User::find($user->ID);

		// First call: Search for existing customer by email - return empty
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'data' => []
			]);

		// Second call: Create customer - return object without id
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'object' => 'customer',
				'email' => 'noid@test.com',
				'name' => 'No ID User',
				'live_mode' => true,
			]);

		// Get live customer should return WP_Error
		$result = $model->getOrCreateLiveCustomerId();
		$this->assertWPError($result);
		$this->assertSame('sc_no_customer_created', $result->get_error_code());
	}

	/**
	 * @group user-model
	 */
	public function test_getOrCreateLiveCustomerId_returnsExistingWhenAlreadyLinked()
	{
		// Create a user
		$user = self::factory()->user->create_and_get([
			'user_email' => 'linked@test.com',
			'display_name' => 'Linked User',
		]);

		$model = User::find($user->ID);

		// Set an existing customer ID first
		$model->setCustomerId('existing_customer_id', 'live');

		// Now when we try to get live customer, it should return the existing one
		$result = $model->getOrCreateLiveCustomerId();

		// Since customer ID already exists, it should just return it without creating a new one
		$this->assertSame('existing_customer_id', $result);
	}

	/**
	 * @group user-model
	 */
	public function test_getOrCreateLiveCustomerIdFindsExistingCustomerByEmail()
	{
		// Mock the requests in the container
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without linked customer
		$user = self::factory()->user->create_and_get([
			'user_email' => 'existing@test.com',
			'display_name' => 'Existing User',
		]);

		$model = User::find($user->ID);

		// Mock the Customer::where request to find existing customer by email
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'data' => [
					(object)[
						'id' => 'existing_customer_from_email',
						'object' => 'customer',
						'email' => 'existing@test.com',
						'live_mode' => true,
					]
				]
			]);

		// Get live customer should find the existing customer and link it
		$customer_id = $model->getOrCreateLiveCustomerId();
		$this->assertSame('existing_customer_from_email', $customer_id);

		// Verify the customer ID was set in user meta
		$this->assertSame('existing_customer_from_email', $model->customerId('live'));
	}

	/**
	 * @group user-model
	 */
	public function test_findAndLinkLiveCustomerByEmailReturnsNullWhenNoCustomerFound()
	{
		// Mock the requests in the container
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without linked customer
		$user = self::factory()->user->create_and_get([
			'user_email' => 'notfound@test.com',
			'display_name' => 'Not Found User',
		]);

		$model = User::find($user->ID);

		// Mock the Customer::where request to return empty result
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'data' => []
			]);

		// findAndLinkLiveCustomerByEmail should return null when no customer found
		$result = $model->findAndLinkLiveCustomerByEmail();
		$this->assertNull($result);
	}

	/**
	 * @group user-model
	 */
	public function test_findAndLinkLiveCustomerByEmailLinksExistingCustomer()
	{
		// Mock the requests in the container
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without linked customer
		$user = self::factory()->user->create_and_get([
			'user_email' => 'link@test.com',
			'display_name' => 'Link User',
		]);

		$model = User::find($user->ID);

		// Mock the Customer::where request to find existing customer
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'data' => [
					(object)[
						'id' => 'found_customer_id',
						'object' => 'customer',
						'email' => 'link@test.com',
						'live_mode' => true,
					]
				]
			]);

		// findAndLinkLiveCustomerByEmail should find and link the customer
		$result = $model->findAndLinkLiveCustomerByEmail();
		$this->assertSame('found_customer_id', $result);

		// Verify the customer ID was linked to user
		$this->assertSame('found_customer_id', $model->customerId('live'));
	}

	/**
	 * @group user-model
	 */
	public function test_createAndLinkLiveCustomerCreatesAndLinksNewCustomer()
	{
		// Mock the requests in the container
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without linked customer
		$user = self::factory()->user->create_and_get([
			'user_email' => 'create@test.com',
			'display_name' => 'Create User',
		]);

		$model = User::find($user->ID);

		// Mock the Customer::create request
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customers')
			->andReturn((object)[
				'id' => 'newly_created_customer_id',
				'object' => 'customer',
				'email' => 'create@test.com',
				'name' => 'Create User',
				'live_mode' => true,
			]);

		// createAndLinkLiveCustomer should create and link the customer
		$result = $model->createAndLinkLiveCustomer();
		$this->assertSame('newly_created_customer_id', $result);

		// Verify the customer ID was linked to user
		$this->assertSame('newly_created_customer_id', $model->customerId('live'));
	}

	/**
	 * @group user-model
	 */
	public function test_createAndLinkLiveCustomerReturnsWPErrorOnFailure()
	{
		// Mock the requests in the container
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create a user without linked customer
		$user = self::factory()->user->create_and_get([
			'user_email' => 'fail@test.com',
			'display_name' => 'Fail User',
		]);

		$model = User::find($user->ID);

		// Mock the Customer::create request to fail
		$requests->shouldReceive('makeRequest')
			->once()
			->andReturn(new \WP_Error('creation_failed', 'Customer creation failed'));

		// createAndLinkLiveCustomer should return WP_Error
		$result = $model->createAndLinkLiveCustomer();
		$this->assertWPError($result);
		$this->assertSame('creation_failed', $result->get_error_code());
	}
}
