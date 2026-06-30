<?php

namespace SureCart\Tests\Services;

use Mockery\MockInterface;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Cache\DoNotCachePageService;

/**
 * @group cache
 */
class DoNotCachePageServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function tearDown(): void {
		parent::tearDown();
		unset( $_SERVER['REQUEST_URI'] );
		unset( $_GET['rest_route'] );
	}

	/**
	 * Create a mock service with protected methods enabled.
	 *
	 * @return MockInterface|DoNotCachePageService
	 */
	protected function createServiceMock() {
		return \Mockery::mock( DoNotCachePageService::class )->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Test the service always bootstraps, regardless of active cache plugins.
	 */
	public function test_always_registers_hooks() {
		$service = new DoNotCachePageService();

		$service->bootstrap();

		$this->assertNotFalse( has_action( 'wp', [ $service, 'maybeDisableCache' ] ) );
		$this->assertNotFalse( has_action( 'rest_api_init', [ $service, 'maybeDisableCacheForRestApi' ] ) );
	}

	/**
	 * Test the service disables cache on excluded pages.
	 */
	public function test_disables_cache_for_customer_dashboard() {
		$service = $this->createServiceMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( true );
		$service->shouldReceive( 'disableCacheWithBrowserHeaders' )->once()->with( 'SureCart customer dashboard' );

		$service->maybeDisableCache();
	}

	/**
	 * Test the service does nothing on regular pages.
	 */
	public function test_does_not_disable_cache_for_regular_page() {
		$service = $this->createServiceMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( false );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( false );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( false );
		$service->shouldReceive( 'isBuyPage' )->andReturn( false );
		$service->shouldReceive( 'disableCacheWithBrowserHeaders' )->never();

		$service->maybeDisableCache();
	}

	/**
	 * Test the service disables cache for SureCart REST requests.
	 */
	public function test_disables_cache_for_surecart_rest_request() {
		$_SERVER['REQUEST_URI'] = '/wp-json/surecart/v1/checkouts';

		$service = $this->createServiceMock();
		$service->shouldReceive( 'disableCacheWithBrowserHeaders' )->once()->with( 'SureCart REST API request' );

		$service->maybeDisableCacheForRestApi();
	}
}
