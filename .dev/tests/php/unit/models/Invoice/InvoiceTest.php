<?php

namespace SureCart\Tests\Models\Invoice;

use Mockery;
use SureCart\Models\Invoice;
use SureCart\Tests\SureCartUnitTestCase;

class InvoiceTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	protected $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void
	{
		parent::setUp();


		//Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
			],
		], false);
	}

	public function test_has_checkout_url_attribute() {
		// mock the page service
		$page_service = Mockery::mock(\SureCart\WordPress\Pages\PageService::class);
		\SureCart::alias('pages', function () use ($page_service) {
			return $page_service;
		});
		$page_service->shouldReceive('url')->with('checkout')->andReturn('http://example.com/checkout');

		// create an invoice with a checkout (with an id)
		$invoice = new Invoice();
		$invoice->checkout = ['id' => 123];
		$this->assertEquals( 'http://example.com/checkout?checkout_id=123', $invoice->checkout_url );
	}
}
