<?php
namespace CheckoutEngine\Tests\Feature\Rest;

use CheckoutEngine\Rest\CheckoutSessionRestServiceProvider;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use WP_REST_Request;

class CheckoutSessionRestServiceProviderTest extends CheckoutEngineUnitTestCase {
/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				CheckoutSessionRestServiceProvider::class,
				\CheckoutEngine\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

	public function test_form_id_required()
	{
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout_sessions');
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 401);

		$this->mock_requests->expects($this->once())
		->method('makeRequest')
		->with(
			$this->equalTo('checkout_sessions'),
			$this->equalTo([
				'method' => 'POST',
				'body' => [
					'checkout_session' => []
				],
				'query' => [
					'form_id' => 'test',
				]
			])
		)
		->willReturn(json_decode('{
			"id": "868ae1cc-7dd1-4bbb-822f-c320cbc65ff1",
			"created_at": 1637709542,
			"updated_at": 1637709542
		  }'));

		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout_sessions');
		$request->set_query_params(['form_id' => 'test']);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);
	}

}
