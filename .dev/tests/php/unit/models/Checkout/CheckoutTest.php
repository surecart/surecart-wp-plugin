<?php

namespace SureCart\Tests\Models\Checkout;

use SureCart\Models\Checkout;
use SureCart\Tests\SureCartUnitTestCase;

class CheckoutTest extends SureCartUnitTestCase
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

	public function test_checkoutHasPurchases() {
		$checkout = new Checkout([
			'id' => 'test',
			'purchases' => (object)[
				'data' => [
					(object)[
						'id' => 'test_purchase',
					]
				]
			]
		]);
		$this->assertInstanceOf(\SureCart\Models\Purchase::class,$checkout->purchases->data[0]);
	}

	/**
	 * @group session
	 * @group models
	 */
	public function test_can_create_draft_checkout()
	{
		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('checkouts'),
				$this->equalTo([
					'method' => 'POST',
					'body' => [
						'checkout' => [
							"currency" => "usd",
							"line_items" => [
								[
									"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
									"quantity" => 2
								]
								],
						]
					],
					'query' => []
				])
			)
			->willReturn((object) [
				"currency" => "usd",
				"line_items" => [
					[
						"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
						"quantity" => 2
					]
				],
				'ip_address' => '127.0.0.1'
			]);

		$created = (new Checkout([
			"currency" => "usd",
			"line_items" => [
				[
					"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
					"quantity" => 2
				]
			]
		]))->save();

		// we don't care about the checkout.
		$this->assertEqualsCanonicalizing($created->getAttributes(), [
			"currency" => "usd",
			"line_items" => [
				[
					"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
					"quantity" => 2
				]
			],
			'ip_address' => '127.0.0.1'
		]);
	}

	/**
	 * @group session
	 * @group models
	 */
	public function test_finalize_checkout()
	{
		$request = json_decode(file_get_contents(dirname(__FILE__) . '/session-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/session-finalized.json'), true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('checkouts/test_checkout/finalize/'),
				$this->equalTo([
					'method' => 'PATCH',
					'body' => [
						"checkout" => [
							"id" => "test_checkout",
							"customer_first_name" => "Joey",
							"customer_last_name" => "Smithy",
							"customer_email" => "joe@gmail.com",
							"currency" => "usd",
							"metadata" => [],
							"line_items" => [
								[
									"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
									"quantity" => 2
								]
							]
						]
					],
					'query' => []
				])
			)
			->willReturn($response);

		$instance = new Checkout($request['checkout'], 'custom');
		$prepared = $instance->finalize();

		// make sure attriutes page
		$this->assertEquals($prepared->getAttributes(), $response);
	}
}
