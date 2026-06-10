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

	/**
	 * @group login
	 */
	public function test_login_returns_nonce() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'    => $this->user->user_login,
			'password' => 'testpassword',
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertArrayHasKey('nonce', $data, 'Login response should include a nonce.');
		$this->assertNotEmpty($data['nonce'], 'Nonce should not be empty.');
	}

	/**
	 * @group login
	 */
	public function test_logout_when_logged_in() {
		wp_set_current_user( $this->user->ID );

		$request  = new \WP_REST_Request('POST', '/surecart/v1/logout');
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertArrayHasKey('nonce', $data, 'Logout response should include a nonce.');
		$this->assertNotEmpty($data['nonce'], 'Nonce should not be empty after logout.');
	}

	/**
	 * @group login
	 */
	public function test_logout_when_not_logged_in() {
		wp_set_current_user( 0 );

		$request  = new \WP_REST_Request('POST', '/surecart/v1/logout');
		$response = rest_do_request( $request );
		$this->assertSame(401, $response->get_status());
		$data = $response->get_data();
		$this->assertSame('rest_not_logged_in', $data['code'], 'Should return rest_not_logged_in error code.');
	}

	/**
	 * @group login
	 */
	public function test_login_returns_avatar_url() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'    => $this->user->user_login,
			'password' => 'testpassword',
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertArrayHasKey('avatar_url', $data, 'Login response should include avatar_url.');
		$this->assertNotEmpty($data['avatar_url'], 'avatar_url should not be empty.');
	}

	/**
	 * @group login
	 */
	public function test_login_returns_name_and_email() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'    => $this->user->user_login,
			'password' => 'testpassword',
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertArrayHasKey('name', $data, 'Login response should include name.');
		$this->assertArrayHasKey('email', $data, 'Login response should include email.');
		$this->assertSame($this->user->display_name, $data['name']);
		$this->assertSame('test@example.com', $data['email']);
	}

	/**
	 * @group login
	 */
	public function test_login_with_invalid_credentials() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'    => $this->user->user_login,
			'password' => 'wrongpassword',
		]);
		$response = rest_do_request( $request );
		$this->assertTrue($response->is_error(), 'Login with wrong password should return an error.');
	}

	/**
	 * @group login
	 */
	public function test_login_with_email() {
		$request = new \WP_REST_Request('POST', '/surecart/v1/login');
		$request->set_body_params([
			'login'    => 'test@example.com',
			'password' => 'testpassword',
		]);
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertSame('test@example.com', $data['email']);
	}

	/**
	 * @group login
	 */
	public function test_logout_destroys_session() {
		wp_set_current_user( $this->user->ID );
		$this->assertTrue(is_user_logged_in(), 'User should be logged in before logout.');

		$request  = new \WP_REST_Request('POST', '/surecart/v1/logout');
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
		$this->assertSame(0, get_current_user_id(), 'Current user should be 0 after logout.');
	}
}
