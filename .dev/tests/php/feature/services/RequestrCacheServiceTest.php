<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;

class RequestCacheServiceTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * @var \SureCart\Application
	 */
	protected $app;

	/**
	 * @var \Mockery\MockInterface
	 */
	protected $request_cache;

	/**
	 * @var \Mockery\MockInterface
	 */
	protected $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		$this->app = \SureCart::make();

		// bootstrap the app.
		$this->app->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		// mock the request service.
		$this->requests = \Mockery::mock(\SureCart\Request\RequestService::class, [$this->app->container(), 'test', '/v1', true ])->makePartial();
		$this->app->container()['requests'] = function () {
			return $this->requests;
		};

		// mock the request cache service for this test.
		$this->request_cache = \Mockery::mock(\SureCart\Request\RequestCacheService::class);
		$this->request_cache->shouldReceive('getTransientCache')->andReturn(false);
		$this->app->container()['requests.cache'] = $this->app->container()->protect(
			function () {
				return $this->request_cache;
			}
		);

		parent::setUp();
	}

	/**
	 * @group cache
	 */
	public function test_serves_manual_payment_method_cache() {
		$this->request_cache->shouldReceive('getPreviousCacheUpdatingState')->andReturn('updating');
		$this->request_cache->shouldReceive('getPreviousCache')
			->andReturn((object)[
				'data' => [
					(object)[
						'id' => 'test',
						'object' => 'manual_payment_method',
					]
				]
			]);
		$this->requests->shouldNotReceive('makeUncachedRequest');

		$manual_payment_methods = \SureCart\Models\ManualPaymentMethod::get();
		$this->assertCount(1, $manual_payment_methods);
		$this->assertSame('test', $manual_payment_methods[0]->id);
	}

	/**
	 * @group cache
	 */
	public function test_serves_processors_method_cache() {
		$this->request_cache->shouldReceive('getPreviousCacheUpdatingState')->andReturn('updating');
		$this->request_cache->shouldReceive('getPreviousCache')
			->andReturn((object)[
				'data' => [
					(object)[
						'id' => 'processor_test',
						'object' => 'processor',
					]
				]
			]);
		$this->requests->shouldNotReceive('makeUncachedRequest');

		$processors = \SureCart\Models\Processor::get();
		$this->assertCount(1, $processors);
		$this->assertSame('processor_test', $processors[0]->id);
	}
}
