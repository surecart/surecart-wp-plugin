<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\CheckoutsController;
use SureCart\Models\Checkout;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class CheckoutsControllerFormIdValidationTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		parent::setUp();
	}

	public function test_can_validate_a_valid_request()
	{
		$controller =\Mockery::mock(CheckoutsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->once()->withSomeOfArgs('products/testid')->andReturn(
			(object) [
				'id' => 'testid',
				'metadata' => (object) [
					'wp_buy_link_enabled' => 'true',
					'wp_buy_link_test_mode_enabled' => 'true'
				]
			]
		);

		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts/testid/finalize');
		$request->set_param('live_mode', false);
		$request->set_param('product_id', 'testid');
		$is_valid = $controller->validateProductId(
			new Checkout((object) ['live_mode' => false, 'line_items' => (object) ['data' => [(object) ['price' => (object) ['product' => (object) ['id' => 'testid']]]]]]),
			$request
		);
		$this->assertNotWPError($is_valid);
	}

	/**
	 * @group checkout
	 */
	public function test_validateFormId()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$controller = \Mockery::mock(CheckoutsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
		$request = new \WP_REST_Request();
		$request->set_param('form_id', 1);
		// form id does not exist.
		$this->assertWPError($controller->validateFormId(
			new Checkout(['live_mode' => false]),
			$request
		));

		// live mode mismatch.
		$controller->shouldReceive('getFormMode')->andReturn('live');
		$this->assertWPError($controller->validateFormId(
			new Checkout(['live_mode' => false]),
			$request
		));

		// shoudl succeed.
		$this->assertNotWPError($controller->validateFormId(
			new Checkout(['live_mode' => true]),
			$request
		));
	}
}
