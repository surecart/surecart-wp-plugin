<?php

namespace SureCart\Tests\Services\Integrations;

use SureCart\Integrations\User\UserService;
use SureCart\Models\Integration;
use SureCart\Tests\SureCartUnitTestCase;

class UserServiceTest extends SureCartUnitTestCase
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
			]
		], false);

		parent::setUp();
	}

	/**
	 * @group integration
	 */
	public function test_Config() {
		$service = new UserService();
		$this->assertSame('surecart/user-role', $service->getName());
		$this->assertSame('product', $service->getModel());
		$this->assertStringContainsString('surecart/images/integrations/wordpress.svg', $service->getLogo());
		$this->assertSame('Add WordPress User Role', $service->getLabel());
		$this->assertSame('Add User Role', $service->getItemLabel());
		$this->assertSame('Add the user role of the user who purchased the product.', $service->getItemHelp());
	}

	/**
	 * @group integration
	 */
	public function test_getItems() {
		$editable_roles = get_editable_roles();
		$items = (new UserService())->getItems();
		$this->assertSame(count($editable_roles) - 1, count($items)); // we remove the admininstrator role.
		foreach($editable_roles as $role => $details) {
			if ( $role === 'administrator') continue;
			$this->assertSame($details['name'], $items[$role]['label']);
			$this->assertSame($role, $items[$role]['id']);
		}
	}

	/**
	 * @group integration
	 */
	public function test_getItem() {
		$service = new UserService();
		$this->assertSame($service->getItem('contributor'), ['id' => 'contributor', 'label' => 'Contributor']);
	}

	/**
	 * @group integration
	 */
	public function test_onPurchaseCreated() {
		$service = \Mockery::mock(UserService::class)->makePartial();
		$integration = new Integration([
			'integration_id' => 'test_id'
		]);
		$user = self::factory()->user->create_and_get();
		$service->shouldReceive('toggleRole')->with($integration->integration_id, $user, true)->once();
		$service->onPurchaseCreated($integration, $user);
	}

	/**
	 * @group integration
	 */
	public function test_onPurchaseInvoked() {
		$service = \Mockery::mock(UserService::class)->makePartial();
		$integration = new Integration([
			'integration_id' => 'contributor'
		]);
		$user = self::factory()->user->create_and_get();
		$service->shouldReceive('toggleRole')->with($integration->integration_id, $user, true)->once();
		$service->onPurchaseInvoked($integration, $user);
	}

	/**
	 * @group integration
	 */
	public function test_onPurchaseRevoked() {
		$service = \Mockery::mock(UserService::class)->makePartial();
		$integration = new Integration([
			'integration_id' => 'contributor'
		]);
		$user = self::factory()->user->create_and_get();
		$service->shouldReceive('toggleRole')->with($integration->integration_id, $user, false)->once();
		$service->onPurchaseRevoked($integration, $user);
	}

	/**
	 * @group integration
	 */
	public function test_toggleRole() {
		$service = new UserService();
		$user = self::factory()->user->create_and_get();
		$this->assertFalse($user->has_role('contributor'));
		$service->toggleRole('contributor', $user, true);
		$this->assertNotFalse(did_action('add_user_role'));
		$service->toggleRole('contributor', $user, true);
		$this->assertNotFalse(did_action('remove_user_role'));
	}
}
