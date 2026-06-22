<?php

namespace SureCart\Tests\Abilities;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Tests\MocksRequestService;
use SureCart\Abilities\Abilities\FilterOrders;
use SureCart\Abilities\Abilities\FilterCustomers;
use SureCart\Abilities\Abilities\FilterSubscriptions;
use SureCart\Abilities\Abilities\GetOrdersFilterSchema;
use SureCart\Abilities\Abilities\GetCustomersFilterSchema;
use SureCart\Abilities\Abilities\GetSubscriptionsFilterSchema;

/**
 * Coverage for the rule-based filter and filter-schema abilities.
 *
 * @group abilities
 */
class FilterAbilitiesTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	use MocksRequestService;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			array(
				'providers' => array(
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
				),
			),
			false
		);
	}

	/**
	 * A rule tree fixture used across filter tests.
	 *
	 * @return array
	 */
	private function rule_tree(): array {
		return array(
			'type'            => 'condition',
			'attribute_name'  => 'status',
			'operator_label'  => 'is',
			'comparison_value' => 'paid',
		);
	}

	/**
	 * FilterOrders posts the rule tree to orders/filter and returns success + orders + pagination.
	 */
	public function test_filter_orders_posts_to_filter_endpoint() {
		$this->mockRequest(
			(object) array(
				'data'       => array( (object) array( 'id' => 'order_1', 'object' => 'order' ) ),
				'pagination' => (object) array( 'count' => 1, 'limit' => 10, 'page' => 1 ),
			),
			$captured
		);

		$rules  = $this->rule_tree();
		$result = ( new FilterOrders() )->execute( array( 'filter' => $rules ) );

		$this->assertEquals( 'orders/filter', $captured[0] );
		$this->assertEquals( 'POST', $captured[1]['method'] );
		$this->assertEquals( array( 'filter' => $rules ), $captured[1]['body'] );

		$this->assertTrue( $result['success'] );
		$this->assertCount( 1, $result['orders'] );
		$this->assertEquals( 'order_1', $result['orders'][0]['id'] );
		$this->assertEquals( 1, $result['pagination']['count'] );
		$this->assertEquals( 1, $result['pagination']['page'] );
		$this->assertEquals( 10, $result['pagination']['limit'] );
	}

	/**
	 * FilterOrders accepts a JSON-string filter and forwards pagination args.
	 */
	public function test_filter_orders_accepts_json_string_and_pagination() {
		$this->mockRequest(
			(object) array(
				'data'       => array(),
				'pagination' => (object) array( 'count' => 0, 'limit' => 25, 'page' => 2 ),
			),
			$captured
		);

		$rules  = $this->rule_tree();
		$result = ( new FilterOrders() )->execute(
			array(
				'filter'   => wp_json_encode( $rules ),
				'page'     => 2,
				'per_page' => 25,
			)
		);

		$this->assertEquals( array( 'filter' => $rules ), $captured[1]['body'] );
		$this->assertEquals( 2, $result['pagination']['page'] );
		$this->assertEquals( 25, $result['pagination']['limit'] );
	}

	/**
	 * FilterCustomers posts the rule tree to customers/filter and returns success + customers.
	 */
	public function test_filter_customers_posts_to_filter_endpoint() {
		$this->mockRequest(
			(object) array(
				'data'       => array( (object) array( 'id' => 'cust_1', 'object' => 'customer' ) ),
				'pagination' => (object) array( 'count' => 1, 'limit' => 10, 'page' => 1 ),
			),
			$captured
		);

		$rules  = $this->rule_tree();
		$result = ( new FilterCustomers() )->execute( array( 'filter' => $rules ) );

		$this->assertEquals( 'customers/filter', $captured[0] );
		$this->assertEquals( 'POST', $captured[1]['method'] );
		$this->assertEquals( array( 'filter' => $rules ), $captured[1]['body'] );

		$this->assertTrue( $result['success'] );
		$this->assertCount( 1, $result['customers'] );
		$this->assertEquals( 'cust_1', $result['customers'][0]['id'] );
	}

	/**
	 * FilterSubscriptions posts the rule tree to subscriptions/filter and returns success + subscriptions.
	 */
	public function test_filter_subscriptions_posts_to_filter_endpoint() {
		$this->mockRequest(
			(object) array(
				'data'       => array( (object) array( 'id' => 'sub_1', 'object' => 'subscription' ) ),
				'pagination' => (object) array( 'count' => 1, 'limit' => 10, 'page' => 1 ),
			),
			$captured
		);

		$rules  = $this->rule_tree();
		$result = ( new FilterSubscriptions() )->execute( array( 'filter' => $rules ) );

		$this->assertEquals( 'subscriptions/filter', $captured[0] );
		$this->assertEquals( 'POST', $captured[1]['method'] );
		$this->assertEquals( array( 'filter' => $rules ), $captured[1]['body'] );

		$this->assertTrue( $result['success'] );
		$this->assertCount( 1, $result['subscriptions'] );
		$this->assertEquals( 'sub_1', $result['subscriptions'][0]['id'] );
	}

	/**
	 * GetOrdersFilterSchema GETs from orders/filter_schema and returns the attributes.
	 */
	public function test_get_orders_filter_schema_gets_from_filter_schema_endpoint() {
		$this->mockRequest(
			(object) array(
				'object'     => 'rule_schema',
				'schema_id'  => 'schema_orders',
				'attributes' => array(
					(object) array(
						'key'              => 'status',
						'type'             => 'enum',
						'operators'        => array( 'is', 'is not' ),
						'supported_values' => array( 'paid', 'void' ),
					),
				),
			),
			$captured
		);

		$result = ( new GetOrdersFilterSchema() )->execute( array() );

		$this->assertEquals( 'orders/filter_schema', $captured[0] );
		$this->assertEquals( 'GET', $captured[1]['method'] );

		$this->assertTrue( $result['success'] );
		$this->assertEquals( 'rule_schema', $result['object'] );
		$this->assertEquals( 'schema_orders', $result['schema_id'] );
		$this->assertCount( 1, $result['attributes'] );
		$this->assertEquals( 'status', $result['attributes'][0]['key'] );
	}

	/**
	 * GetCustomersFilterSchema GETs from customers/filter_schema.
	 */
	public function test_get_customers_filter_schema_gets_from_filter_schema_endpoint() {
		$this->mockRequest( (object) array( 'object' => 'rule_schema', 'attributes' => array() ), $captured );

		$result = ( new GetCustomersFilterSchema() )->execute( array() );

		$this->assertEquals( 'customers/filter_schema', $captured[0] );
		$this->assertEquals( 'GET', $captured[1]['method'] );
		$this->assertTrue( $result['success'] );
	}

	/**
	 * GetSubscriptionsFilterSchema GETs from subscriptions/filter_schema.
	 */
	public function test_get_subscriptions_filter_schema_gets_from_filter_schema_endpoint() {
		$this->mockRequest( (object) array( 'object' => 'rule_schema', 'attributes' => array() ), $captured );

		$result = ( new GetSubscriptionsFilterSchema() )->execute( array() );

		$this->assertEquals( 'subscriptions/filter_schema', $captured[0] );
		$this->assertEquals( 'GET', $captured[1]['method'] );
		$this->assertTrue( $result['success'] );
	}

	/**
	 * An empty filter returns the invalid_filter error without making a request.
	 */
	public function test_filter_orders_empty_filter_returns_error_without_request() {
		$this->mockRequestNeverCalled();

		$result = ( new FilterOrders() )->execute( array() );

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'invalid_filter', $result->get_error_code() );
	}

	/**
	 * A non-array, non-JSON filter returns the invalid_filter error without making a request.
	 */
	public function test_filter_orders_invalid_filter_returns_error_without_request() {
		$this->mockRequestNeverCalled();

		$result = ( new FilterOrders() )->execute( array( 'filter' => 'not-json' ) );

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'invalid_filter', $result->get_error_code() );
	}

	/**
	 * An unsafe comparison_value is sanitized in the body actually sent to the API.
	 */
	public function test_filter_orders_sanitizes_comparison_value_in_request_body() {
		$this->mockRequest(
			(object) array(
				'data'       => array(),
				'pagination' => (object) array( 'count' => 0, 'limit' => 10, 'page' => 1 ),
			),
			$captured
		);

		$dirty    = "  paid<script>alert(1)</script>\n\tvalue  ";
		$expected = sanitize_text_field( $dirty );

		$result = ( new FilterOrders() )->execute(
			array(
				'filter' => array(
					'type'             => 'condition',
					'attribute_name'   => 'status',
					'operator_label'   => 'is',
					'comparison_value' => $dirty,
				),
			)
		);

		$this->assertEquals( 'orders/filter', $captured[0] );
		$this->assertEquals( 'POST', $captured[1]['method'] );
		$this->assertEquals( $expected, $captured[1]['body']['filter']['comparison_value'] );
		$this->assertTrue( $result['success'] );
	}

	/**
	 * Unknown extra keys in a condition are stripped from the body sent to the API.
	 */
	public function test_filter_orders_strips_unknown_keys_from_request_body() {
		$this->mockRequest(
			(object) array(
				'data'       => array(),
				'pagination' => (object) array( 'count' => 0, 'limit' => 10, 'page' => 1 ),
			),
			$captured
		);

		( new FilterOrders() )->execute(
			array(
				'filter' => array(
					'type'             => 'condition',
					'attribute_name'   => 'status',
					'operator_label'   => 'is',
					'comparison_value' => 'paid',
					'evil'             => 'x',
				),
			)
		);

		$sent = $captured[1]['body']['filter'];
		$this->assertArrayNotHasKey( 'evil', $sent );
		$this->assertEqualsCanonicalizing(
			array( 'type', 'attribute_name', 'operator_label', 'comparison_value' ),
			array_keys( $sent )
		);
	}

	/**
	 * A rule with a type that is neither condition nor group returns invalid_filter without a request.
	 */
	public function test_filter_orders_unknown_type_returns_error_without_request() {
		$this->mockRequestNeverCalled();

		$result = ( new FilterOrders() )->execute( array( 'filter' => array( 'type' => 'bogus' ) ) );

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'invalid_filter', $result->get_error_code() );
	}

	/**
	 * A group with an invalid combinator returns invalid_filter without a request.
	 */
	public function test_filter_orders_invalid_combinator_returns_error_without_request() {
		$this->mockRequestNeverCalled();

		$result = ( new FilterOrders() )->execute(
			array(
				'filter' => array(
					'type'       => 'group',
					'combinator' => 'xor',
					'conditions' => array( $this->rule_tree() ),
				),
			)
		);

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'invalid_filter', $result->get_error_code() );
	}

	/**
	 * All six new abilities are annotated readonly, non-destructive, idempotent.
	 */
	public function test_new_abilities_are_readonly() {
		$abilities = array(
			new FilterOrders(),
			new FilterCustomers(),
			new FilterSubscriptions(),
			new GetOrdersFilterSchema(),
			new GetCustomersFilterSchema(),
			new GetSubscriptionsFilterSchema(),
		);

		foreach ( $abilities as $ability ) {
			$annotations = $ability->get_annotations();
			$this->assertTrue( $annotations['readonly'], $ability->get_name() );
			$this->assertFalse( $annotations['destructive'], $ability->get_name() );
			$this->assertTrue( $annotations['idempotent'], $ability->get_name() );
		}
	}

	/**
	 * Permission checks reflect the matching read capability.
	 */
	public function test_permission_checks_reflect_capabilities() {
		$admin = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$user  = get_user_by( 'id', $admin );
		$user->add_cap( 'read_sc_orders' );
		$user->add_cap( 'read_sc_customers' );
		$user->add_cap( 'read_sc_subscriptions' );
		wp_set_current_user( $admin );

		$this->assertTrue( ( new FilterOrders() )->check_permission() );
		$this->assertTrue( ( new FilterCustomers() )->check_permission() );
		$this->assertTrue( ( new FilterSubscriptions() )->check_permission() );
		$this->assertTrue( ( new GetOrdersFilterSchema() )->check_permission() );
		$this->assertTrue( ( new GetCustomersFilterSchema() )->check_permission() );
		$this->assertTrue( ( new GetSubscriptionsFilterSchema() )->check_permission() );

		$subscriber = self::factory()->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $subscriber );

		$this->assertFalse( ( new FilterOrders() )->check_permission() );
		$this->assertFalse( ( new FilterCustomers() )->check_permission() );
		$this->assertFalse( ( new FilterSubscriptions() )->check_permission() );
		$this->assertFalse( ( new GetOrdersFilterSchema() )->check_permission() );
		$this->assertFalse( ( new GetCustomersFilterSchema() )->check_permission() );
		$this->assertFalse( ( new GetSubscriptionsFilterSchema() )->check_permission() );
	}
}
