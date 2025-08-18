<?php

namespace SureCart\Tests\Services;

use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class RequestServiceTest extends SureCartUnitTestCase
{
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
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		parent::setUp();
	}

	/**
	 * @group request
	 */
	public function test_gets_base_url()
	{
		$service = new RequestService( [], 'token' );
		$this->assertSame(SURECART_API_URL . '/v1/', $service->getBaseUrl());
	}

	/**
	 * @group request
	 * @dataProvider cacheProvider
	 */
	public function test_shouldFindCache(bool $cachable, string $cache_key, array $args, bool $expected) {
		$service = new RequestService([], 'token');
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

	/**
	 * @group request
	 */
	public function test_shouldNotMakeRequestIfNoToken() {
		// setup mocks.
		$request_cache = \Mockery::mock(\SureCart\Request\RequestCacheService::class);
		$service = \Mockery::mock( RequestService::class, [[], null] )->makePartial();
		$service->shouldReceive('cache')->andReturn( $request_cache );

		// make the request.
		$this->assertWPError( $service->makeRequest( 'test') );
		$error = $service->makeRequest( 'test' );
		$this->assertSame( 'missing_token', $error->get_error_code() );
	}

	/**
	 * @group request
	 */
	public function test_shouldRetry409Requests() {
		// setup mocks.
		$request_cache = \Mockery::mock(\SureCart\Request\RequestCacheService::class);
		$error_service = \Mockery::mock(\SureCart\Support\Errors\ErrorsService::class);
		$error_service->shouldReceive('translate')->andReturn('test');
		$service = \Mockery::mock( RequestService::class, [[], 'token'] )->makePartial();
		$service->shouldReceive('cache')->andReturn( $request_cache );
		$service->shouldReceive('errors')->andReturn( $error_service );

		// 409 response mock should be called twice as a retry (and only twice).
		$service->shouldReceive( 'remoteRequest' )
			// make sure the same arguments are passed each time.
			->withArgs(function ($url, $args) {
				return str_contains($url, 'test') && $args['method'] === 'POST' && !empty($args['body']);
			})
			->twice()
			->andReturn( [
				'response' => [
					'code' => 409
				]
			] );

		// make the request.
		$service->makeUncachedRequest('test', [
			'method' => 'POST',
			'body' => [
				'test' => 'test'
			]
		]);

		// another status code should only be called once.
		$service->shouldReceive( 'remoteRequest' )
		->once()
		->andReturn( [
			'response' => [
				'code' => 404
			]
		] );

		// make the request.
		$service->makeUncachedRequest('test');
	}

	/**
	 * Test that bad_gateway errors are properly handled.
	 * 
	 * @group request
	 */
	public function test_bad_gateway_error_handling() {				
		// mock the requests in the container with proper container injection and a token
		$requests =  \Mockery::mock(RequestService::class, [\SureCart::getApplication()->container(), 'test-token', '/v1', true])->makePartial();
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		
		// Mock remote request to return bad_gateway response
		$requests
			->shouldReceive( 'remoteRequest' )
			->once()
			->andReturn( [
				'response' => [
					'code' => 502
				],
				'body' => wp_json_encode([
					'code' => 'bad_gateway',
					'type' => 'bad_gateway',
					'http_status' => 'bad_gateway',
					'message' => 'Charge ch_3Rh3nCCAyH09BTUT1QpGDreU has been charged back; cannot issue a refund.',
					'validation_errors' => []
				])
			] );

		// Make the request
		$result = \SureCart\Models\Checkout::update(['id' => 1]);
		
		// Assert it's a WP_Error with the correct details
		$this->assertWPError( $result );
		$this->assertEquals( 'bad_gateway', $result->get_error_code() );
		$this->assertEquals( 'Charge ch_3Rh3nCCAyH09BTUT1QpGDreU has been charged back; cannot issue a refund.', $result->get_error_message() );
	}
}
