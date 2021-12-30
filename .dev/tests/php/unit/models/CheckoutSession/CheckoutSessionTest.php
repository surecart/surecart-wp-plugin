<?php

namespace CheckoutEngine\Tests\Models\CheckoutSession;

use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class CheckoutSessionTest extends CheckoutEngineUnitTestCase
{
	protected $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();

		parent::setUp();
	}

	/**
	 * @group session
	 * @group models
	 */
	public function test_can_create_session()
	{
		$request = json_decode(file_get_contents(dirname(__FILE__) . '/session-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/session-created.json'));
		$response_array = json_decode(file_get_contents(dirname(__FILE__) . '/session-created.json'), true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('checkout_sessions'),
				$this->equalTo([
					'method' => 'POST',
					'body' => $request,
					'query' => []
				])
			)
			->willReturn($response);

		$instance = new CheckoutSession($request['checkout_session']);
		$created = $instance->create();

		// we don't care about the order.
		$this->assertEqualsCanonicalizing($created->toArray(), $response_array);
	}

	/**
	 * @group session
	 * @group models
	 */
	public function test_can_finalize_session()
	{
		$request = json_decode(file_get_contents(dirname(__FILE__) . '/session-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/session-finalized.json'), true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('checkout_sessions/test_session/finalize/custom'),
				$this->equalTo([
					'method' => 'PATCH',
					'body' => $request,
					'query' => []
				])
			)
			->willReturn($response);

		$instance = new CheckoutSession($request['checkout_session'], 'custom');
		$prepared = $instance->finalize();

		$this->assertEquals($prepared->toArray(), $response);
	}
}
