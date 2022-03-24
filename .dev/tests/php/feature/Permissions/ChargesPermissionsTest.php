<?php
namespace SureCart\Tests;

use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;


class ChargesPermissionsTest extends SureCartUnitTestCase {
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

	public function test_edit_permissions()
	{
		\SureCart::plugin()->activation()->bootstrap();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('charges/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'charges',
				'customer' => 'testcustomerid'
			]);

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'sc_customer_id', 'testcustomerid' );

		$this->assertFalse(user_can($user, 'read_sc_charges')); // they can't read charges
		$this->assertFalse(user_can($user, 'edit_sc_charge', 'testid')); // they can't edit charges
		$this->assertFalse(user_can($user, 'read_sc_charge', 'testid')); // they can read a specific charge
	}
}
