<?php
namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\VerificationCodeRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class VerificationCodeRestServiceProviderTest extends SureCartUnitTestCase {
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
				VerificationCodeRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function test_verify_validation() {
		// validation - needs email.
		$request = new \WP_REST_Request('POST', '/surecart/v1/verification_codes/verify');
		$response = rest_do_request( $request );
		$this->assertTrue($response->is_error());
		$this->assertSame('invalid_email', $response->as_error()->get_error_code());
	}

	public function test_verify_success() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->once()->andReturn((object) ['verified' => true]);

		$request = new \WP_REST_Request('POST', '/surecart/v1/verification_codes/verify');
		$request->set_body_params([
			'login' => self::factory()->user->create_and_get()->user_email,
			'code' => 'test_code'
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status(), 'Verification status code is not success.');
		$this->assertTrue(is_user_logged_in(), 'User is not logged in when verifying a code.');
	}

	public function test_verify_failure() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->once()->andReturn((object) ['verified' => false]);

		$request = new \WP_REST_Request('POST', '/surecart/v1/verification_codes/verify');
		$request->set_body_params([
			'login' => self::factory()->user->create_and_get()->user_email,
			'code' => 'test_code'
		]);
		$response = rest_do_request( $request );
		$this->assertTrue($response->is_error());
		$this->assertSame('invalid_code', $response->as_error()->get_error_code());
	}

	/**
	 * @group login
	 */
	public function test_verify_with_internal_redirect() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->once()->andReturn((object) ['verified' => true]);

		$request = new \WP_REST_Request('POST', '/surecart/v1/verification_codes/verify');
		$request->set_body_params([
			'login' => self::factory()->user->create_and_get()->user_email,
			'code' => 'test_code',
			'redirect_to' => '/dashboard'
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertNotNull($data['redirect_url'], 'Redirect URL should not be null for internal URLs.');
		$this->assertStringContainsString('/dashboard', $data['redirect_url']);
	}

	/**
	 * @group login
	 */
	public function test_verify_rejects_external_redirect() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->once()->andReturn((object) ['verified' => true]);

		$request = new \WP_REST_Request('POST', '/surecart/v1/verification_codes/verify');
		$request->set_body_params([
			'login' => self::factory()->user->create_and_get()->user_email,
			'code' => 'test_code',
			'redirect_to' => 'https://malicious-site.com/phishing'
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		// wp_validate_redirect returns false for external URLs, which is then set to null or false.
		$this->assertEmpty($data['redirect_url'], 'Redirect URL should be empty/false for external URLs.');
	}

	/**
	 * @group login
	 */
	public function test_verify_rejects_javascript_protocol() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->once()->andReturn((object) ['verified' => true]);

		$request = new \WP_REST_Request('POST', '/surecart/v1/verification_codes/verify');
		$request->set_body_params([
			'login' => self::factory()->user->create_and_get()->user_email,
			'code' => 'test_code',
			'redirect_to' => 'javascript:alert("XSS")'
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertEmpty($data['redirect_url'], 'Redirect URL should be empty/false for javascript: protocol.');
	}
}
