<?php

namespace SureCart\Tests\Models;

use SureCart\Models\Order;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;

class OrderTest extends SureCartUnitTestCase
{
	protected $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([], false);
		parent::setUp();
	}


	public function test_can_filter_pdf_url() {
		add_filter("surecart/order/attributes/pdf_url", function($url) {
			return 'https://changed.com';
		});

		$order = new Order([
			'pdf_url' => 'https://test.com'
		]);

		$this->assertSame('https://changed.com', $order->pdf_url);
	}
}
