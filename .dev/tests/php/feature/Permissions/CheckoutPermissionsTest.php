<?php
namespace SureCart\Tests;

use SureCart\Models\User;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;


class CheckoutPermissionsTest extends SureCartUnitTestCase {
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
				\SureCart\Permissions\RolesServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\WordPress\PostTypes\FormPostTypeServiceProvider::class,
				\SureCart\Activation\ActivationServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_edit_and_view_draft_permissions()
	{
		\SureCart::plugin()->activation()->bootstrap();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('checkouts/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'checkout',
				'customer' => 'anybody',
				'status' => 'draft'
			]);

		$user = self::factory()->user->create_and_get();

		$this->assertFalse(user_can($user, 'read_sc_checkouts', 'Users should not be able to read checkouts by default'));
		$this->assertTrue(user_can($user, 'edit_sc_checkout', 'testid'), 'Anyone can edit a draft checkout.');
		$this->assertTrue(user_can($user, 'read_sc_checkout', 'testid', 'Anyone can read a draft checkout.'));
	}

	public function test_edit_and_view_paid_completed_permissions() {
		\SureCart::plugin()->activation()->bootstrap();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('checkouts/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'checkout',
				'customer' => 'testcustomerid',
				'status' => 'completed'
			]);

		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');

		$this->assertFalse(user_can($user->ID, 'read_sc_checkouts'));
		$this->assertFalse(user_can($user->ID, 'edit_sc_checkout', 'testid'));
		$this->assertTrue(user_can($user->ID, 'read_sc_checkout', 'testid'));

		$requests->shouldReceive('makeRequest')
		->withSomeOfArgs('checkouts/testid')
		->andReturn((object) [
			'id' => 'testid',
			'object' => 'checkout',
			'customer' => 'testcustomerid',
			'status' => 'paid'
		]);

		$this->assertFalse(user_can($user->ID, 'read_sc_checkouts'));
		$this->assertFalse(user_can($user->ID, 'edit_sc_checkout', 'testid'));
		$this->assertTrue(user_can($user->ID, 'read_sc_checkout', 'testid'));
	}

}
