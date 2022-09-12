<?php
namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\CheckoutRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class CheckoutRestServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				CheckoutRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function test_can_finalize()
	{
		$test_form = self::factory()->post->create_and_get( array(
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form {"mode":"test"} --><!-- /wp:surecart/form -->'
		) );

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('checkouts/testid/finalize/')
			->andReturn([
				'email' => 'test@test.com'
			]);

		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/testid/finalize');
		$request->set_query_params(['form_id'=> $test_form->ID]);
		$request->set_param('processor_type', 'stripe');
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);
	}

	public function test_form_id_required()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->never();

		// must pass form id.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/testid/finalize');
		$request->set_param('processor_type', 'stripe');
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 400);
		$this->assertSame($response->get_data()['code'], 'form_id_required');

		// must be a valid form id.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/testid/finalize');
		$request->set_param('processor_type', 'stripe');
		$request->set_param('form_id', 1234567789);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 400);
		$this->assertSame($response->get_data()['code'], 'form_id_invalid');
	}

	public function test_form_test_mode()
	{
		$test_form = self::factory()->post->create_and_get( array(
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form {"mode":"test"} --><!-- /wp:surecart/form -->'
		) );

		$live_form = self::factory()->post->create_and_get( array(
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form {"mode":"live"} --><!-- /wp:surecart/form -->'
		) );

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->andReturn([]);

		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts');
		$request->set_param('live_mode', false);
		$request->set_query_params(['form_id'=> $test_form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);

		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts');
		$request->set_param('live_mode', true);
		$request->set_query_params(['form_id'=> $live_form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);

		// don't let someone make a test payment on a form that is live.
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts');
		$request->set_param('live_mode', false);
		$request->set_query_params(['form_id'=> $live_form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 400);
	}

	public function test_live_payments_are_always_allowed()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$form = self::factory()->post->create_and_get( array(
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form {"mode":"test"} --><!-- /wp:surecart/form -->'
		) );

		$requests->shouldReceive('makeRequest')->andReturn([]);

		// always allow forced live payments, even on a test form.
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts');
		$request->set_param('live_mode', true);
		$request->set_query_params(['form_id'=> $form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);

		// default to live if no mode is sent with the request, even if the form is in test mode.
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts');
		$request->set_query_params(['form_id'=> $form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);
	}

	public function test_has_user_in_response() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->andReturn([]);

		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test');
		$request->set_param('email', 'test@test.com');
		$response = rest_do_request( $request );
		$data = $response->get_data();
		$this->assertSame($data['email_exists'], false);

		self::factory()->user->create([
			'user_email' => 'test@test.com'
		]);
		$response = rest_do_request( $request );
		$data = $response->get_data();
		$this->assertSame($data['email_exists'], true);
	}

}
