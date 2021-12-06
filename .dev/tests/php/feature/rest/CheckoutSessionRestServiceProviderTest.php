<?php
namespace CheckoutEngine\Tests\Feature\Rest;

use CheckoutEngine\Request\RequestServiceProvider;
use CheckoutEngine\Rest\CheckoutSessionRestServiceProvider;
use CheckoutEngine\Support\Errors\ErrorsServiceProvider;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use WP_REST_Request;

class CheckoutSessionRestServiceProviderTest extends CheckoutEngineUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				CheckoutSessionRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function test_can_finalize()
	{
		$test_form = self::factory()->post->create_and_get( array(
			'post_type' => 'ce_form',
			'post_content' => '<!-- wp:checkout-engine/form {"mode":"test"} --><!-- /wp:checkout-engine/form -->'
		) );

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('checkout_sessions/testid/finalize/stripe?expand[]=payment_intent')
			->andReturn([]);

		$request = new WP_REST_Request('PATCH', '/checkout-engine/v1/checkout_sessions/testid/finalize/stripe?expand[]=payment_intent');
		$request->set_query_params(['form_id'=> $test_form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);
	}

	public function test_form_id_required()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->never();

		// must pass form id.
		$request = new WP_REST_Request('PATCH', '/checkout-engine/v1/checkout_sessions/123testid/finalize/stripe');
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 400);
		$this->assertSame($response->get_data()['code'], 'form_id_required');

		// must be a valid form id.
		$request = new WP_REST_Request('PATCH', '/checkout-engine/v1/checkout_sessions/123testid/finalize/stripe');
		$request->set_param('form_id', 1234567789);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 400);
		$this->assertSame($response->get_data()['code'], 'form_id_invalid');
	}

	public function test_form_test_mode()
	{
		$test_form = self::factory()->post->create_and_get( array(
			'post_type' => 'ce_form',
			'post_content' => '<!-- wp:checkout-engine/form {"mode":"test"} --><!-- /wp:checkout-engine/form -->'
		) );

		$live_form = self::factory()->post->create_and_get( array(
			'post_type' => 'ce_form',
			'post_content' => '<!-- wp:checkout-engine/form {"mode":"live"} --><!-- /wp:checkout-engine/form -->'
		) );

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('checkout_sessions','test')
			->andReturn([]);

		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout_sessions');
		$request->set_param('live_mode', false);
		$request->set_query_params(['form_id'=> $test_form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('checkout_sessions','live')
			->andReturn([]);

		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout_sessions');
		$request->set_param('live_mode', true);
		$request->set_query_params(['form_id'=> $live_form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);

		// don't let someone make a test payment on a form that is live.
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout_sessions');
		$request->set_param('live_mode', false);
		$request->set_query_params(['form_id'=> $live_form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 400);
	}

	public function test_live_payments_are_always_allowed()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$form = self::factory()->post->create_and_get( array(
			'post_type' => 'ce_form',
			'post_content' => '<!-- wp:checkout-engine/form {"mode":"test"} --><!-- /wp:checkout-engine/form -->'
		) );

		$requests->shouldReceive('makeRequest')
		->twice()
		->withSomeOfArgs('checkout_sessions','live')
		->andReturn([]);

		// always allow forced live payments, even on a test form.
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout_sessions');
		$request->set_param('live_mode', true);
		$request->set_query_params(['form_id'=> $form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);

		// default to live if no mode is sent with the request, even if the form is in test mode.
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout_sessions');
		$request->set_query_params(['form_id'=> $form->ID]);
		$response = rest_do_request( $request );
		$this->assertSame($response->get_status(), 200);
	}

}
