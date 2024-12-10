<?php
namespace SureCart\Tests\Feature\Rest;

use SureCart\Models\User;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\SubscriptionRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class SubscriptionRestServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				SubscriptionRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function basicRequestProvider(){
		return [
			'List: Unauthenticated' => [null, 'GET','/surecart/v1/subscriptions', 401],
			'List: Missing Capability' => [[], 'GET','/surecart/v1/subscriptions', 403],
			'List: Has Capability' =>  [['read_sc_subscriptions'], 'GET','/surecart/v1/subscriptions', 200],
			'Find: Unauthenticated' => [null, 'GET','/surecart/v1/subscriptions/test', 401],
			'Find: Without Capability' => [[], 'GET','/surecart/v1/subscriptions/test', 403],
			'Find: Has Capability' => [['read_sc_subscriptions'], 'GET','/surecart/v1/subscriptions/test', 200],
			'Create: Unauthenticated' => [null, 'POST','/surecart/v1/subscriptions', 404],
			'Create: Without Capability' => [[], 'POST','/surecart/v1/subscriptions', 404],
			'Create: Has Capability' => [['publish_sc_subscriptions'], 'POST','/surecart/v1/subscriptions', 404],
			'Update: Unauthenticated' => [null, 'PUT','/surecart/v1/subscriptions/test', 401],
			'Update: Without Capability' => [[], 'PUT','/surecart/v1/subscriptions/test', 403],
			'Update: Has Capability' => [['edit_sc_subscriptions'], 'PUT','/surecart/v1/subscriptions/test', 200],
			'Delete: Unauthenticated' => [null, 'DELETE','/surecart/v1/subscriptions/test', 404],
			'Delete: Without Capability' => [[], 'DELETE','/surecart/v1/subscriptions/test', 404],
			'Delete: Has Capability' => [['delete_sc_subscriptions'], 'DELETE','/surecart/v1/subscriptions/test', 404],
		];
	}

	/**
	 * @dataProvider basicRequestProvider
	 */
	public function test_permissions($caps, $method, $route, $status) {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->andReturn((object) ['id' => 'test']);

		if (is_array($caps)) {
			$user= self::factory()->user->create_and_get();
			foreach($caps as $cap) {
				$user->add_cap($cap);
			}
			wp_set_current_user($user->ID ?? null);
		}

		// make rest request.
		$request = new \WP_REST_Request($method, $route);
		$response = rest_do_request( $request );
		$this->assertSame($status, $response->get_status());
	}

	public function customerRequestProvider(){
		return [
			'List: All' => ['GET','/surecart/v1/subscriptions', 403],
			'List: Own' => ['GET','/surecart/v1/subscriptions', 200, ['query' => ['customer_ids' => ['correct_customer_id']]]],
			'List: Others' => ['GET','/surecart/v1/subscriptions', 403, ['query' => ['customer_ids' => ['wrong_customer_id']]]],
			'Find: Own' => ['GET','/surecart/v1/subscriptions/correct', 200],
			'Find: Others' => ['GET','/surecart/v1/subscriptions/wrong', 403],
			'Cancel: Own' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['cancel_at_period_end' => true ]]],
			'Cancel: Others' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['cancel_at_period_end' => true ]]],
			'Update Payment Method: Own' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['payment_method' => 'test' ]]],
			'Update Payment Method: Others' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['payment_method' => 'test' ]]],
			'Purge Pending Update: Own' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['purge_pending_update' => true ]]],
			'Purge Pending Update: Others' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['purge_pending_update' => true ]]],
			'Cancellation Act: Own' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['cancellation_act' => 'test' ]]],
			'Cancellation Act: Others' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['cancellation_act' => 'test' ]]],
			'Manual Payment Method: Own' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['manual_payment_method' => 'test' ]]],
			'Manual Payment Method: Others' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['manual_payment_method' => 'test' ]]],
			'Ad Hoc Amount: Own' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['ad_hoc_amount' => 123 ]]],
			'Ad Hoc Amount: Others' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['ad_hoc_amount' => 123 ]]],
			'Discount: Own' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['discount' => 'asdf' ]]],
			'Discount: Others' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['discount' => 'asdf' ]]],

			// These require account mocks.
			'Quantity: Own with protocol enabled' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['quantity' => 2 ]], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_quantity_updates_enabled' => true
						]
					];
				});
			}],
			'Quantity: Others with protocol enabled' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['quantity' => 2 ]], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_quantity_updates_enabled' => true
						]
					];
				});
			}],
			'Quantity: Own with protocol disabled' => ['PUT','/surecart/v1/subscriptions/correct', 403, ['body' => ['quantity' => 2 ]], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_quantity_updates_enabled' => false
						]
					];
				});
			}],
			'Price: Own with protocol enabled' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['price' => 'test']], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_updates_enabled' => true
						]
					];
				});
			}],
			'Price: Others with protocol enabled' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['price' => 'test']], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_updates_enabled' => true
						]
					];
				});
			}],
			'Price: Own with protocol disabled' => ['PUT','/surecart/v1/subscriptions/correct', 403, ['body' => ['price' => 'test']], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_updates_enabled' => false
						]
					];
				});
			}],
			'Variant: Own with protocol enabled' => ['PUT','/surecart/v1/subscriptions/correct', 200, ['body' => ['variant' => 'test']], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_updates_enabled' => true
						]
					];
				});
			}],
			'Variant: Others with protocol enabled' => ['PUT','/surecart/v1/subscriptions/wrong', 403, ['body' => ['variant' => 'test']], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_updates_enabled' => true
						]
					];
				});
			}],
			'Variant: Own with protocol disabled' => ['PUT','/surecart/v1/subscriptions/correct', 403, ['body' => ['variant' => 'test']], function() {
				\SureCart::alias('account', function () {
					return (object) [
						'customer_portal_protocol' => (object) [
							'subscription_updates_enabled' => false
						]
					];
				});
			}],
		];
	}

	/**
	 * @group subscriptions
	 * @dataProvider customerRequestProvider
	 */
	public function test_customer_permissions($method, $route, $status, $params = [], $setup = null) {
		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('correct_customer_id');
		wp_set_current_user($user->ID);

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('subscriptions')->andReturn((object) ['customer' => 'correct_customer_id']);
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('subscriptions/correct')->andReturn((object) ['customer' => 'correct_customer_id']);
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('subscriptions/wrong')->andReturn((object) ['customer' => 'wrong_customer_id']);


		if ( ! empty($setup)) {
			$setup();
		}

		// make rest request.
		$request = new \WP_REST_Request($method, $route);
		if (!empty($params['query'])) {
			$request->set_query_params($params['query']);
		}
		if ( ! empty($params['body'])) {
			$request->set_body_params($params['body']);
		}
		$response = rest_do_request( $request );
		$this->assertSame($status, $response->get_status());
	}

	/**
	 * @group subscriptions
	 */
	public function test_can_preserve_permissions() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('subscriptions/test_id')->once()->andReturn((object) ['customer' => 'testcustomerid']);
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('subscriptions/test_id/preserve/')->once()->andReturn((object) ['customer' => 'testcustomerid']);

		// security
		$request = new \WP_REST_Request('PATCH', '/surecart/v1/subscriptions/test_id/preserve');
		$response = rest_do_request( $request );
		$this->assertTrue($response->is_error());
		$this->assertSame(401, $response->get_status(), 'Danger: Anyone can preserve.');

		$user = self::factory()->user->create_and_get();
		wp_set_current_user($user->ID);
		$request = new \WP_REST_Request('PATCH', '/surecart/v1/subscriptions/test_id/preserve');
		$response = rest_do_request( $request );
		$this->assertTrue($response->is_error());
		$this->assertSame(403, $response->get_status(), 'Danger: Anyone can preserve.');

		// missing permission
		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');
		wp_set_current_user($user->ID);
		$request = new \WP_REST_Request('PATCH', '/surecart/v1/subscriptions/test_id/preserve');
		$request->set_body_params(['cancellation_act' => [
			'cancellation_id' => '123',
			'comment' => 'sadsf'
		]]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
	}
}
