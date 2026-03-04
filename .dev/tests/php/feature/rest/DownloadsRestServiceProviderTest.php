<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Account\AccountServiceProvider;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\DownloadRestServiceProvider;
use SureCart\Settings\SettingsServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class DownloadRestServiceProviderTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		//Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				AccountServiceProvider::class,
				DownloadRestServiceProvider::class,
				SettingsServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class,
			],
			'permission_controllers' => [
				\SureCart\Permissions\Models\DownloadPermissionsController::class,
			],
		], false);
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown() : void
	{
		wp_set_current_user(0);
		parent::tearDown();
	}

	public function requestProvider()
	{
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/downloads', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/downloads', 403],
			'List: Has Capability' => [['read_sc_downloads'],'GET', '/surecart/v1/downloads', 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/downloads/test', 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/downloads/test', 403],
			'Find: Has Capability' => [['read_sc_medias'], 'GET', '/surecart/v1/downloads/test', 200],
		];
	}

	public function listWithVariantIdsProvider() {
		return [
			'Single variant ID'    => [ [ 'test-variant-id' ] ],
			'Multiple variant IDs' => [ [ 'variant-id-1', 'variant-id-2' ] ],
		];
	}

	/**
	 * Test that variant_ids filter is forwarded to the API call.
	 *
	 * @dataProvider listWithVariantIdsProvider
	 */
	public function test_list_with_variant_ids_filter( $variant_ids ) {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias( 'request', function () use ( $requests ) {
			return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
		} );

		$requests->shouldReceive( 'makeRequest' )
			->withArgs( function ( $endpoint, $args ) use ( $variant_ids ) {
				return 'downloads' === $endpoint
					&& isset( $args['query']['variant_ids'] )
					&& $args['query']['variant_ids'] === $variant_ids;
			} )
			->once()
			->andReturn( (object) [
				'id' => 'test',
			] );

		$user = self::factory()->user->create_and_get();
		$user->add_cap( 'read_sc_downloads' );
		wp_set_current_user( $user->ID );

		$request = new \WP_REST_Request( 'GET', '/surecart/v1/downloads' );
		$request->set_query_params( [ 'variant_ids' => $variant_ids ] );
		$response = rest_do_request( $request );
		$this->assertSame( 200, $response->get_status() );
	}

	/**
	 * Test that variant_ids filter is denied for unauthorized users.
	 */
	public function test_list_with_variant_ids_filter_unauthorized() {
		$user = self::factory()->user->create_and_get();
		wp_set_current_user( $user->ID );

		$request = new \WP_REST_Request( 'GET', '/surecart/v1/downloads' );
		$request->set_query_params( [ 'variant_ids' => [ 'test-variant-id' ] ] );
		$response = rest_do_request( $request );
		$this->assertSame( 403, $response->get_status() );
	}

	public function listWithProductIdsProvider() {
		return [
			'Single product ID'    => [ [ 'test-product-id' ] ],
			'Multiple product IDs' => [ [ 'product-id-1', 'product-id-2' ] ],
		];
	}

	/**
	 * Test that product_ids filter is forwarded to the API call.
	 *
	 * @dataProvider listWithProductIdsProvider
	 */
	public function test_list_with_product_ids_filter( $product_ids ) {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias( 'request', function () use ( $requests ) {
			return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
		} );

		$requests->shouldReceive( 'makeRequest' )
			->withArgs( function ( $endpoint, $args ) use ( $product_ids ) {
				return 'downloads' === $endpoint
					&& isset( $args['query']['product_ids'] )
					&& $args['query']['product_ids'] === $product_ids;
			} )
			->once()
			->andReturn( (object) [
				'id' => 'test',
			] );

		$user = self::factory()->user->create_and_get();
		$user->add_cap( 'read_sc_downloads' );
		wp_set_current_user( $user->ID );

		$request = new \WP_REST_Request( 'GET', '/surecart/v1/downloads' );
		$request->set_query_params( [ 'product_ids' => $product_ids ] );
		$response = rest_do_request( $request );
		$this->assertSame( 200, $response->get_status() );
	}

	/**
	 * Test that product_ids filter is denied for unauthorized users.
	 */
	public function test_list_with_product_ids_filter_unauthorized() {
		$user = self::factory()->user->create_and_get();
		wp_set_current_user( $user->ID );

		$request = new \WP_REST_Request( 'GET', '/surecart/v1/downloads' );
		$request->set_query_params( [ 'product_ids' => [ 'test-product-id' ] ] );
		$response = rest_do_request( $request );
		$this->assertSame( 403, $response->get_status() );
	}

	/**
	 * @dataProvider requestProvider
	 */
	public function test_permissions($caps, $method, $route, $status){
		//mock the requests in the container
        $requests = \Mockery::mock(RequestService::class);
        \SureCart::alias('request', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

        $requests->shouldReceive('makeRequest')
            ->andReturn((object) [
                'id' => 'test',
            ]);

        if (is_array($caps)) {
            $user = self::factory()->user->create_and_get();
            foreach ($caps as $cap) {
                $user->add_cap($cap);
            }

            wp_set_current_user($user->ID ?? null);
        }

        $request = new \WP_REST_Request($method, $route);
        $response = rest_do_request($request);
        $this->assertSame($status, $response->get_status());
	}

	public function customerRequestProvider()
	{
		return [
			'List: All' => ['GET', '/surecart/v1/downloads', 403, []],
			'List: Own' => ['GET', '/surecart/v1/downloads', 200, ['query' => ['customer_ids' => ['correct_customer_id']]]],
			'List: Others' => ['GET', '/surecart/v1/downloads', 403, ['query' => ['customer_ids' => ['wrong_customer_id']]]],
		];
	}

	/**
	 * @dataProvider customerRequestProvider
	 */
	public function test_customer_permissions($method, $route, $status, $params = []){
		//mock the requests in the container
        $requests = \Mockery::mock(RequestService::class);
        \SureCart::alias('request', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

        $requests->shouldReceive('makeRequest')
            ->andReturn((object) [
                'id' => 'test',
            ]);

		// Create user with customer ID in the test method, not in the data provider
		$wp_user = self::factory()->user->create_and_get();
		$user = \SureCart\Models\User::find($wp_user->ID);
		$user->setCustomerId('correct_customer_id');

        wp_set_current_user($wp_user->ID);

        $request = new \WP_REST_Request($method, $route);
		if (is_array($params) && isset($params['query'])) {
            $request->set_query_params($params['query']);
        }

        $response = rest_do_request($request);
        $this->assertSame($status, $response->get_status());
	}
}
