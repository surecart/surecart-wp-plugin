<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Account\AccountServiceProvider;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\ReviewsRestServiceProvider;
use SureCart\Settings\SettingsServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class ReviewsRestServiceProviderTest extends SureCartUnitTestCase
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
				ReviewsRestServiceProvider::class,
				RequestServiceProvider::class,
				SettingsServiceProvider::class,
				ErrorsServiceProvider::class,
			],
		], false);
	}

	public function requestProvider()
	{
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/reviews', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/reviews', 403],
			'List: Has Capability' => [['read_sc_reviews'],'GET', '/surecart/v1/reviews', 200],

			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/reviews/test', 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/reviews/test', 403],
			'Find: Has Capability' => [['read_sc_review'], 'GET', '/surecart/v1/reviews/test', 200],

			'Edit: Unauthenticated' => [null, 'PATCH', '/surecart/v1/reviews/test', 401],
			'Edit: Missing Capability' => [[], 'PATCH', '/surecart/v1/reviews/test', 403],
			'Edit: Has Capability' => [['edit_sc_reviews'], 'PATCH', '/surecart/v1/reviews/test', 200],

			'Delete: Unauthenticated' => [null, 'DELETE', '/surecart/v1/reviews/test', 401],
			'Delete: Missing Capability' => [[], 'DELETE', '/surecart/v1/reviews/test', 403],
			'Delete: Has Capability' => [['delete_sc_review'], 'DELETE', '/surecart/v1/reviews/test', 200],

			'Publish: Unauthenticated' => [null, 'PATCH', '/surecart/v1/reviews/test/publish', 401],
			'Publish: Missing Capability' => [[], 'PATCH', '/surecart/v1/reviews/test/publish', 403],
			'Publish: Has Capability' => [['edit_sc_reviews'], 'PATCH', '/surecart/v1/reviews/test/publish', 200],

			'Unpublish: Unauthenticated' => [null, 'PATCH', '/surecart/v1/reviews/test/unpublish', 401],
			'Unpublish: Missing Capability' => [[], 'PATCH', '/surecart/v1/reviews/test/unpublish', 403],
			'Unpublish: Has Capability' => [['edit_sc_reviews'], 'PATCH', '/surecart/v1/reviews/test/unpublish', 200],

			// Any authenticated user can create a review.
			'Create: Unauthenticated' => [null, 'POST', '/surecart/v1/reviews', 401],
		];
	}

	/**
	 * @dataProvider requestProvider
     * @group reviews
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
}
