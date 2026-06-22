<?php

namespace SureCart\Tests\Models\Filter;

use SureCart\Models\Order;
use SureCart\Models\Customer;
use SureCart\Models\Subscription;
use SureCart\Models\Collection;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Model-level coverage for the CanFilter trait across Order, Customer and Subscription.
 */
class CanFilterTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
				],
			],
			false
		);
	}

	/**
	 * Mock the request service and capture the args passed to makeRequest.
	 *
	 * @param mixed $return Value to return from makeRequest.
	 * @param array $captured Reference filled with the makeRequest args.
	 * @return void
	 */
	protected function mockRequest( $return, &$captured ) {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->andReturnUsing(
				function ( ...$args ) use ( $return, &$captured ) {
					$captured = $args;
					return $return;
				}
			);
	}

	public function test_order_filter_posts_to_filter_endpoint() {
		$this->mockRequest(
			(object) [
				'data'       => [ [ 'id' => 'order_1', 'object' => 'order' ] ],
				'pagination' => (object) [ 'count' => 1, 'limit' => 20, 'page' => 1 ],
			],
			$captured
		);

		$rules      = [ 'type' => 'condition', 'attribute_name' => 'status', 'operator_label' => 'is', 'comparison_value' => 'paid' ];
		$collection = ( new Order() )->filter( $rules );

		$this->assertInstanceOf( Collection::class, $collection );
		$this->assertEquals( 'orders/filter', $captured[0] );
		$this->assertEquals( 'POST', $captured[1]['method'] );
		$this->assertEquals( [ 'filter' => $rules ], $captured[1]['body'] );
	}

	public function test_order_filter_schema_gets_from_filter_schema_endpoint() {
		$this->mockRequest( (object) [ 'object' => 'rule_schema' ], $captured );

		( new Order() )->filterSchema();

		$this->assertEquals( 'orders/filter_schema', $captured[0] );
		$this->assertEquals( 'GET', $captured[1]['method'] );
	}

	public function test_customer_filter_posts_to_filter_endpoint() {
		$this->mockRequest(
			(object) [
				'data'       => [ [ 'id' => 'cust_1', 'object' => 'customer' ] ],
				'pagination' => (object) [ 'count' => 1, 'limit' => 20, 'page' => 1 ],
			],
			$captured
		);

		$rules = [ 'type' => 'condition', 'attribute_name' => 'email', 'operator_label' => 'is', 'comparison_value' => 'a@b.com' ];
		( new Customer() )->filter( $rules );

		$this->assertEquals( 'customers/filter', $captured[0] );
		$this->assertEquals( 'POST', $captured[1]['method'] );
		$this->assertEquals( [ 'filter' => $rules ], $captured[1]['body'] );
	}

	public function test_customer_filter_schema_gets_from_filter_schema_endpoint() {
		$this->mockRequest( (object) [ 'object' => 'rule_schema' ], $captured );

		( new Customer() )->filterSchema();

		$this->assertEquals( 'customers/filter_schema', $captured[0] );
		$this->assertEquals( 'GET', $captured[1]['method'] );
	}

	public function test_subscription_filter_posts_to_filter_endpoint() {
		$this->mockRequest(
			(object) [
				'data'       => [ [ 'id' => 'sub_1', 'object' => 'subscription' ] ],
				'pagination' => (object) [ 'count' => 1, 'limit' => 20, 'page' => 1 ],
			],
			$captured
		);

		$rules = [ 'type' => 'condition', 'attribute_name' => 'status', 'operator_label' => 'is', 'comparison_value' => 'active' ];
		( new Subscription() )->filter( $rules );

		$this->assertEquals( 'subscriptions/filter', $captured[0] );
		$this->assertEquals( 'POST', $captured[1]['method'] );
		$this->assertEquals( [ 'filter' => $rules ], $captured[1]['body'] );
	}

	public function test_subscription_filter_schema_gets_from_filter_schema_endpoint() {
		$this->mockRequest( (object) [ 'object' => 'rule_schema' ], $captured );

		( new Subscription() )->filterSchema();

		$this->assertEquals( 'subscriptions/filter_schema', $captured[0] );
		$this->assertEquals( 'GET', $captured[1]['method'] );
	}
}
