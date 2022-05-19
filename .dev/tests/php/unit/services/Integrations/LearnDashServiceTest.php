<?php

namespace SureCart\Tests\Services\Integrations;

use SureCart\Integrations\LearnDash\LearnDashService;
use SureCart\Models\Integration;
use SureCart\Tests\SureCartUnitTestCase;

class LearnDashServiceTest extends SureCartUnitTestCase
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
	public function test_learnDashConfig() {
		$learndash = new LearnDashService();
		$this->assertSame($learndash->getName(), 'surecart/learndash-course');
		$this->assertSame($learndash->getModel(), 'product');
		$this->assertStringContainsString('surecart/images/integrations/learndash.svg', $learndash->getLogo());
		$this->assertSame($learndash->getLabel(), 'LearnDash Course');
		$this->assertSame($learndash->getItemLabel(), 'Course Access');
		$this->assertSame($learndash->getItemHelp(), 'Enable access to a LearnDash course.');
	}

	/**
	 * @group integration
	 */
	public function test_getItems() {
		$course = self::factory()->post->create_and_get( array(
			'post_type' => 'sfwd-courses',
		) );
		$learndash = new LearnDashService();
		$this->assertCount(1, $learndash->getItems());
		$this->assertSame($course->ID, $learndash->getItems()[0]->id);
		$this->assertSame($course->post_title, $learndash->getItems()[0]->label);
	}

	/**
	 * @group integration
	 */
	public function test_getItem() {
		$course = self::factory()->post->create_and_get( array(
			'post_type' => 'sfwd-courses',
		) );
		$learndash = new LearnDashService();
		$this->assertEmpty($learndash->getItem(123424125125125));

		$item = $learndash->getItem($course->ID);
		$this->assertSame($course->ID, $item->id);
		$this->assertSame('LearnDash Course', $item->provider_label);
		$this->assertSame($course->post_title, $item->label);
	}

	/**
	 * @group integration
	 */
	public function test_onPurchaseCreated() {
		$service = \Mockery::mock(LearnDashService::class)->makePartial();
		$integration = new Integration([
			'integration_id' => 'test_id'
		]);
		$user = self::factory()->user->create_and_get();
		$service->shouldReceive('updateAccess')->with($integration->integration_id, $user, true)->once();
		$service->onPurchaseCreated($integration, $user);
	}

	/**
	 * @group integration
	 */
	public function test_onPurchaseInvoked() {
		$service = \Mockery::mock(LearnDashService::class)->makePartial();
		$integration = new Integration([
			'integration_id' => 'test_id'
		]);
		$user = self::factory()->user->create_and_get();
		$service->shouldReceive('updateAccess')->with($integration->integration_id, $user, true)->once();
		$service->onPurchaseInvoked($integration, $user);
	}

	/**
	 * @group integration
	 */
	public function test_onPurchaseRevoked() {
		$service = \Mockery::mock(LearnDashService::class)->makePartial();
		$integration = new Integration([
			'integration_id' => 'test_id'
		]);
		$user = self::factory()->user->create_and_get();
		$service->shouldReceive('updateAccess')->with($integration->integration_id, $user, false)->once();
		$service->onPurchaseRevoked($integration, $user);
	}

	/**
	 * @group integration
	 */
	public function test_updateAccess() {
		// should not error if learndash is not installed.
		$learndash = new LearnDashService();
		$this->assertNull($learndash->updateAccess(1234, 'user', true));
	}
}
