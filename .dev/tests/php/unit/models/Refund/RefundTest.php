<?php

namespace SureCart\Tests\Models\Refund;

use SureCart\Models\Charge;
use SureCart\Tests\SureCartUnitTestCase;
class RefundTest extends SureCartUnitTestCase
{
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

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
					]
				],
				'query' => []
			])
		)
		->willReturn((object)[
			"id" => "48ecc3b6-b20c-4ac5-b62e-976ad68cdb85",
			"object" => "refund",
			"amount" => 9900,
		]);

		$charge = new Charge(['id' => 'test_charge_id']);
		$charge->refund()->create( [
				'amount' => 9900,
			] );
	}
}
