<?php
namespace CheckoutEngine\Tests\Feature\Rest;

use CheckoutEngine\Rest\UploadsRestServiceProvider;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use WP_REST_Request;

class UploadsRestServiceProviderTest extends CheckoutEngineUnitTestCase {
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				UploadsRestServiceProvider::class,
				\CheckoutEngine\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

	public function test_create_upload_permissions()
	{
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/uploads');
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 401);

		$user = $this->factory->user->create_and_get();
		wp_set_current_user( $user->ID );

		$request = new WP_REST_Request('POST', '/checkout-engine/v1/uploads');
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 403);

		$user->add_cap('upload_files');
		wp_set_current_user( $user->ID );
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/uploads');
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 403);
	}

	public function test_can_create_upload()
	{
		$user = $this->factory->user->create_and_get();
		$user->add_cap('upload_files');
		$user->add_cap('edit_ce_products');
		wp_set_current_user( $user->ID );

		$this->mock_requests->expects($this->once())
		->method('makeRequest')
		->with(
			$this->equalTo('uploads'),
			$this->equalTo([
				'method' => 'POST',
				'body' => [
					'upload' => [
						'metadata' => [
							'wp_created_by' => $user->ID,
						]
					]
				],
				'query' => []
			])
		)
		->willReturn(json_decode('{
			"id": "868ae1cc-7dd1-4bbb-822f-c320cbc65ff1",
			"object": "upload",
			"status": "pending",
			"url": null,
			"direct_upload": {
			  "url": null,
			  "headers": null
			},
			"created_at": 1637709542,
			"updated_at": 1637709542
		  }'));

		$request = new WP_REST_Request('POST', '/checkout-engine/v1/uploads');
		$response = rest_do_request( $request );

		$this->assertSame($response->get_status(), 200);
	}
}
