<?php

namespace CheckoutEngine\Tests\Models;

use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Request\RequestService;
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
	 * Tear down our test app instance.
	 */
	public function tearDown() {
		\CheckoutEngine::setApplication( null );
	}

	public function test_can_create_session()
	{
		$data = json_decode('{
			"checkout_session": {
				"customer_first_name": "Joe",
    			"customer_last_name": "Smith",
    			"customer_email": "joe@gmail.com",
    			"currency": "usd",
    			"metadata": {},
    			"line_items": [
					{
						"price_id": "85109619-529d-47b3-98c3-ca90d22913e4",
						"quantity": 1
					}
				]
			}
    	}', true);

		$response = json_decode('{
			"id": "48ce1ca4-4a98-4dd3-8eb1-45995042bec2",
			"object": "checkout_session",
			"customer_email": "joe@gmail.com",
			"customer_first_name": "Joe",
			"customer_last_name": "Smith",
			"currency": "usd",
			"amount_subtotal": 9900,
			"amount_total": 9900,
			"status": "standing_by",
			"metadata": {},
			"created_at": 1624395689,
			"updated_at": 1624395689,
			"line_items": [
			  {
				"id": "d86d0efb-d991-42c2-8b57-382f368be6c5",
				"object": "line_item",
				"quantity": 1,
				"amount_subtotal": 9900,
				"amount_total": 9900,
				"created_at": 1624395689,
				"updated_at": 1624395689,
				"price": {
				  "id": "85109619-529d-47b3-98c3-ca90d22913e4",
				  "object": "price",
				  "name": "Gold Plan",
				  "active": true,
				  "amount": 9900,
				  "currency": "usd",
				  "recurring": false,
				  "recurring_interval": null,
				  "recurring_interval_count": null,
				  "product_id": "b5eb983f-93fe-429b-afcb-de7d1db2f2e4",
				  "created_at": 1623178499,
				  "updated_at": 1623878807
				}
			  }
			],
			"customer": null,
			"processor_intent": null
		  }', true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('checkout_sessions'),
				$this->equalTo([
					'method' => 'POST',
					'body' => $data
				])
			)
			->willReturn($response);

		$instance = new CheckoutSession($data['checkout_session']);
		$created = $instance->create();

		$this->assertEquals($created->toArray(), $response);
	}

	public function test_can_prepare_session()
	{
		$request = json_decode('{
			"checkout_session": {
			  "id": "test_session",
			  "customer_first_name": "Joey",
			  "customer_last_name": "Smithy",
			  "customer_email": "joe@gmail.com",
			  "currency": "usd",
			  "metadata": {},
			  "line_items": [
				{
					"id": "d86d0efb-d991-42c2-8b57-382f368be6c5",
					"price_id": "85109619-529d-47b3-98c3-ca90d22913e4",
				  	"quantity": 2,
					"_destroy": false
				}
			  ]
			}
		  }', true);

		$response = json_decode('{
			"id": "48ce1ca4-4a98-4dd3-8eb1-45995042bec2",
			"object": "checkout_session",
			"customer_email": "joe@gmail.com",
			"customer_first_name": "Joey",
			"customer_last_name": "Smithy",
			"currency": "usd",
			"amount_subtotal": 9900,
			"amount_total": 9900,
			"status": "prepared",
			"metadata": {},
			"created_at": 1624395689,
			"updated_at": 1624395744,
			"line_items": [
			  {
				"id": "d86d0efb-d991-42c2-8b57-382f368be6c5",
				"object": "line_item",
				"quantity": 1,
				"amount_subtotal": 9900,
				"amount_total": 9900,
				"created_at": 1624395689,
				"updated_at": 1624395689,
				"price": {
				  "id": "85109619-529d-47b3-98c3-ca90d22913e4",
				  "object": "price",
				  "name": "Gold Plan",
				  "active": true,
				  "amount": 9900,
				  "currency": "usd",
				  "recurring": false,
				  "recurring_interval": null,
				  "recurring_interval_count": null,
				  "product_id": "b5eb983f-93fe-429b-afcb-de7d1db2f2e4",
				  "created_at": 1623178499,
				  "updated_at": 1623878807
				}
			  }
			],
			"customer": {
			  "id": "3e0572f1-58b8-4d1b-aa29-a48a319c0c49",
			  "object": "customer",
			  "email": "joe@gmail.com",
			  "name": null,
			  "phone": null,
			  "created_at": 1624395743,
			  "updated_at": 1624395743
			},
			"processor_intent": {
			  "id": "691d1abb-543d-4872-8175-e1e3aa2af98a",
			  "object": "processor_intent",
			  "processor_type": "stripe",
			  "external_intent_id": "pi_1J5GjjA50F0KxEv1MoIZfRHE",
			  "created_at": 1624395743,
			  "updated_at": 1624395744
			}
		  }', true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('checkout_sessions/test_session/prepare/custom'),
				$this->equalTo([
					'method' => 'PATCH',
					'body' => $request
				])
			)
			->willReturn($response);

		$instance = new CheckoutSession($request['checkout_session'], 'custom');
		$prepared = $instance->prepare();

		$this->assertEquals($prepared->toArray(), $response);
	}
}
