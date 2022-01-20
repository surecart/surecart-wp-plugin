<?php

namespace CheckoutEngine\Tests\Models\Refund;

use CheckoutEngine\Models\Refund;
use CheckoutEngine\Models\Charge;
use CheckoutEngine\Models\Price;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class RefundTest extends CheckoutEngineUnitTestCase
{
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

	/**
	 * @group failing
	 */
	public function test_can_refund()
	{
		$this->mock_requests->expects($this->once())
		->method('makeRequest')
		->with(
			$this->equalTo('refunds'),
			$this->equalTo([
				'method' => 'POST',
				'body' => [
					"refund" => [
						"amount" => 9900,
						'charge' => 'test_charge_id',
						"metadata"=> [
							'price_ids' => [
								'test_price_id',
								'test_price_id_2'
							]
						],
					]
				],
				'query' => []
			])
		)
		->willReturn((object)[
			"id" => "48ecc3b6-b20c-4ac5-b62e-976ad68cdb85",
			"object" => "refund",
			"amount" => 9900,
			"metadata"=> [
				'price_ids' => [
					'test_price_id',
					'test_price_id_2'
				]
			],
		]);

		$charge = new Charge(['id' => 'test_charge_id']);
		$refund = $charge->refund()
			->forPriceIds( [
				'test_price_id',
				'test_price_id_2'
			] )->create( [
				'amount' => 9900,
			] );

		$this->assertTrue($refund->hasPriceId('test_price_id'));
		$this->assertTrue($refund->hasPriceId('test_price_id_2'));
		$this->assertTrue($refund->hasPriceIds(['test_price_id', 'test_price_id_2']));
	}
}
