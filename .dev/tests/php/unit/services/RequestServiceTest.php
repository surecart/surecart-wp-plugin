<?php

namespace SureCart\Tests\Services;

use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class RequestServiceTest extends SureCartUnitTestCase
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

	public function test_gets_base_url()
	{
		$service = new RequestService();
		$this->assertSame(SURECART_APP_URL . '/v1/', $service->getBaseUrl());
	}

	/**
	 * @dataProvider cacheProvider
	 * @group failing
	 */
	public function test_shouldFindCache(bool $cachable, string $cache_key, array $args =[], bool $expected) {
		$service = new RequestService();
		$this->assertSame($service->shouldFindCache($cachable, $cache_key, $args), $expected);
	}

	public function cacheProvider(): array {
		return [
			[true, 'test', ['method' => 'GET'], true],
			[true, '', ['method' => 'GET'], false],
			[false, '', ['method' => 'GET', 'query' => ['cached' => true]], true],
			[true, 'string', ['method' => 'GET', 'query' => ['cached' => false]], false],
			[true, 'string', ['method' => 'POST'], false],
		];
	}
}
