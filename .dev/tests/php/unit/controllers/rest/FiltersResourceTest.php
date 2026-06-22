<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Models\Order;
use SureCart\Tests\MocksRequestService;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Controllers\Rest\OrderController;
use WP_Error;
use WP_REST_Request;

/**
 * Controller-level coverage for the FiltersResource trait, exercised through OrderController.
 */
class FiltersResourceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	use MocksRequestService;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Support\Errors\ErrorsServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
				],
			],
			false
		);
	}

	/**
	 * Build a filter request with an optional JSON body.
	 *
	 * @param array|null $rules Rule tree to send under the filter key, or null for an empty body.
	 * @return \WP_REST_Request
	 */
	protected function filterRequest( $rules = null ) {
		$request = new WP_REST_Request( 'POST', '/surecart/v1/orders/filter' );
		$request->add_header( 'content-type', 'application/json' );
		if ( null !== $rules ) {
			$request->set_body( wp_json_encode( [ 'filter' => $rules ] ) );
		}
		return $request;
	}

	/**
	 * The filter handler short-circuits and returns the middleware WP_Error without touching the model.
	 */
	public function test_filter_returns_middleware_error_and_skips_model() {
		$this->mockRequestNeverCalled();

		add_filter(
			'surecart/request/model',
			function () {
				return new WP_Error( 'rest_forbidden', 'Forbidden.' );
			}
		);

		$response = ( new OrderController() )->filter( $this->filterRequest() );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'rest_forbidden', $response->get_error_code() );

		remove_all_filters( 'surecart/request/model' );
	}

	/**
	 * The filter_schema handler short-circuits and returns the middleware WP_Error without touching the model.
	 */
	public function test_filter_schema_returns_middleware_error_and_skips_model() {
		$this->mockRequestNeverCalled();

		add_filter(
			'surecart/request/model',
			function () {
				return new WP_Error( 'rest_forbidden', 'Forbidden.' );
			}
		);

		$request  = new WP_REST_Request( 'GET', '/surecart/v1/orders/filter_schema' );
		$response = ( new OrderController() )->filter_schema( $request );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'rest_forbidden', $response->get_error_code() );

		remove_all_filters( 'surecart/request/model' );
	}

	/**
	 * The filter handler sets pagination headers from the returned collection.
	 */
	public function test_filter_sets_total_and_total_pages_headers() {
		$this->mockRequest(
			(object) [
				'data'       => [ [ 'id' => 'order_1', 'object' => 'order' ] ],
				'pagination' => (object) [ 'count' => 21, 'limit' => 20, 'page' => 1 ],
			],
			$captured
		);

		$rules    = [ 'type' => 'condition', 'attribute_name' => 'status', 'operator_label' => 'is', 'comparison_value' => 'paid' ];
		$response = ( new OrderController() )->filter( $this->filterRequest( $rules ) );

		$headers = $response->get_headers();
		// 21 / 20 rounds up to 2 pages.
		$this->assertEquals( 21, $headers['X-WP-Total'] );
		$this->assertEquals( 2, $headers['X-WP-TotalPages'] );
		$this->assertEquals( [ 'filter' => $rules ], $captured[1]['body'] );
	}

	/**
	 * The filter handler returns the model WP_Error when filtering fails.
	 */
	public function test_filter_returns_model_error() {
		$this->mockRequest( new WP_Error( 'filter_failed', 'Could not filter.' ), $captured );

		$rules    = [ 'type' => 'condition', 'attribute_name' => 'status', 'operator_label' => 'is', 'comparison_value' => 'paid' ];
		$response = ( new OrderController() )->filter( $this->filterRequest( $rules ) );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'filter_failed', $response->get_error_code() );
	}

	/**
	 * An empty/null JSON body does not warn and passes an empty rule tree. Regression for null-body guard.
	 */
	public function test_filter_with_empty_body_passes_empty_rule_tree() {
		$this->mockRequest(
			(object) [
				'data'       => [],
				'pagination' => (object) [ 'count' => 0, 'limit' => 20, 'page' => 1 ],
			],
			$captured
		);

		$response = ( new OrderController() )->filter( $this->filterRequest() );

		$headers = $response->get_headers();
		$this->assertEquals( 0, $headers['X-WP-Total'] );
		$this->assertEquals( 0, $headers['X-WP-TotalPages'] );
		$this->assertEquals( [ 'filter' => [] ], $captured[1]['body'] );
	}

	/**
	 * The filter_schema handler proxies to the model filterSchema and returns its result.
	 */
	public function test_filter_schema_proxies_to_model() {
		$this->mockRequest( (object) [ 'object' => 'rule_schema' ], $captured );

		$request = new WP_REST_Request( 'GET', '/surecart/v1/orders/filter_schema' );
		$result  = ( new OrderController() )->filter_schema( $request );

		$this->assertEquals( 'orders/filter_schema', $captured[0] );
		$this->assertEquals( 'GET', $captured[1]['method'] );
		$this->assertEquals( 'rule_schema', $result->object );
	}
}
