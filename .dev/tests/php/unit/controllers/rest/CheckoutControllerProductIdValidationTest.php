<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Models\Checkout;
use SureCart\Controllers\Rest\CheckoutsController;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class CheckoutsControllerProductIdValidationTest extends SureCartUnitTestCase
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

	/**
	 * @group failing
	 */
	public function test_requires_product_id()
	{
		$controller = \Mockery::mock(CheckoutsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
		// must have a product id.
		$this->assertWPError($controller->validateProductId(
			new Checkout(['live_mode' => false]),
			new \WP_REST_Request()
		));
	}

	public function test_requires_valid_product_id() {
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$controller = \Mockery::mock(CheckoutsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
		// product id does not exist.
		$requests->shouldReceive('makeRequest')
		->once()
		->withSomeOfArgs('products/test')
		->andReturn(new \WP_Error());

		$request = new \WP_REST_Request();
		$request->set_param('product_id', 'test');
		$this->assertWPError($controller->validateProductId(
			new Checkout(['live_mode' => false]),
			$request
		));
	}


	public function test_requires_product_id_to_be_in_checkout() {
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$controller = \Mockery::mock(CheckoutsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
		// product id does not exist.
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('products/test1')
			->andReturn((object) (object) ['live_mode' => false, 'line_items' => (object) ['data' => [(object) ['price' => (object) ['product' => (object) ['id' => 'notit']]]]]]);

		$request = new \WP_REST_Request();
		$request->set_param('product_id', 'test1');
		$this->assertWPError($controller->validateProductId(
			new Checkout(['live_mode' => false]),
			$request
		));
	}

	public function test_requires_product_id_wp_buy_form_mode_to_match() {
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$controller = \Mockery::mock(CheckoutsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
		$requests->shouldReceive('makeRequest')->once()->withSomeOfArgs('products/testid')->andReturn(
			(object) [
				'id' => 'testid',
				'metadata' => (object) [
					'wp_buy_link_enabled' => 'true',
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
		$this->assertWPError($is_valid);
	}

	public function test_can_validate_a_valid_request() {
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$controller = \Mockery::mock(CheckoutsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
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
}
