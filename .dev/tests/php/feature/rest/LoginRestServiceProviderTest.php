<?php
namespace SureCart\Tests\Feature\Rest;

use SureCart\Rest\LoginRestServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class LoginRestServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * User for testing.
	 *
	 * @var \WP_User
	 */
	protected $user;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				LoginRestServiceProvider::class,
			]
		], false);

		// Create a test user.
		$this->user = self::factory()->user->create_and_get([
			'user_login' => 'testuser',
			'user_pass'  => 'testpassword',
			'user_email' => 'test@example.com',
		]);
	}

	/**
	 * @group login
	 */
	public function test_login_with_internal_redirect() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'       => $this->user->user_login,
			'password'    => 'testpassword',
			'redirect_to' => '/dashboard',
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
	public function test_login_rejects_external_redirect() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'       => $this->user->user_login,
			'password'    => 'testpassword',
			'redirect_to' => 'https://malicious-site.com/phishing',
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
	public function test_login_rejects_javascript_protocol() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'       => $this->user->user_login,
			'password'    => 'testpassword',
			'redirect_to' => 'javascript:alert("XSS")',
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertEmpty($data['redirect_url'], 'Redirect URL should be empty/false for javascript: protocol.');
	}
}
