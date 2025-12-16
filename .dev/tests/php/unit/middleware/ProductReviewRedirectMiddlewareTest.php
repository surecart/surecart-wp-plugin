<?php

namespace SureCart\Tests\Middleware;

use Mockery;
use SureCart\Middleware\ProductReviewRedirectMiddleware;
use SureCart\Tests\SureCartUnitTestCase;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

/**
 * @group middleware
 * @group product-review
 */
class ProductReviewRedirectMiddlewareTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Middleware instance.
	 *
	 * @var ProductReviewRedirectMiddleware
	 */
	protected $middleware;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();

		// Set up an app instance with necessary providers for Product model
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\Sync\SyncServiceProvider::class,
				\SureCart\WordPress\Posts\PostServiceProvider::class,
			],
		], false);

		// Mock the account service to prevent WordPress hooks from failing
		$mock_account = Mockery::mock('stdClass');
		$mock_account->id = 'test_account_id';

		\SureCart::alias('account', function () use ($mock_account) {
			return $mock_account;
		});

		$this->middleware = new ProductReviewRedirectMiddleware();
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		parent::tearDown();
		wp_set_current_user(0);
	}

	/**
	 * Test that middleware passes to next when product_id is missing.
	 */
	public function test_should_pass_to_next_when_product_id_is_missing() {
		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn(null);
		$request->shouldReceive('query')
			->with('context')
			->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next = function ($req) use (&$next_called) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle($request, $next);

		$this->assertTrue($next_called, 'Next middleware should be called when product_id is missing');
		$this->assertSame('next_response', $response);
	}

	/**
	 * Test that middleware passes to next when context is missing.
	 */
	public function test_should_pass_to_next_when_context_is_missing() {
		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn('123');
		$request->shouldReceive('query')
			->with('context')
			->andReturn(null);

		$next_called = false;
		$next = function ($req) use (&$next_called) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle($request, $next);

		$this->assertTrue($next_called, 'Next middleware should be called when context is missing');
		$this->assertSame('next_response', $response);
	}

	/**
	 * Test that middleware passes to next when context is incorrect.
	 */
	public function test_should_pass_to_next_when_context_is_incorrect() {
		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn('123');
		$request->shouldReceive('query')
			->with('context')
			->andReturn('some.other.context');

		$next_called = false;
		$next = function ($req) use (&$next_called) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle($request, $next);

		$this->assertTrue($next_called, 'Next middleware should be called when context is incorrect');
		$this->assertSame('next_response', $response);
	}

	/**
	 * Test that middleware passes to next when product doesn't exist.
	 */
	public function test_should_pass_to_next_when_product_does_not_exist() {
		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn('999999'); // Non-existent product ID
		$request->shouldReceive('query')
			->with('context')
			->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next = function ($req) use (&$next_called) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle($request, $next);

		$this->assertTrue($next_called, 'Next middleware should be called when product does not exist');
		$this->assertSame('next_response', $response);
	}

	/**
	 * Test that middleware passes to next when product has no post.
	 */
	public function test_should_pass_to_next_when_product_has_no_post() {
		// Create a trashed product post to simulate no valid post
		$post_id = self::factory()->post->create([
			'post_type'   => 'sc_product',
			'post_status' => 'trash',
			'post_title'  => 'Test Product',
			'meta_input'  => [
				'sc_id' => 'sc_test_product_123',
				'product' => wp_json_encode([
					'id'         => 'sc_test_product_123',
					'name'       => 'Test Product',
				]),
			],
		]);

		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn('sc_test_product_123');
		$request->shouldReceive('query')
			->with('context')
			->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next = function ($req) use (&$next_called) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle($request, $next);

		$this->assertTrue($next_called, 'Next middleware should be called when product has no valid post');
		$this->assertSame('next_response', $response);

		// Clean up
		wp_delete_post($post_id, true);
	}

	/**
	 * Test that middleware redirects to product review page when user is logged in.
	 */
	public function test_should_redirect_to_product_review_page_when_logged_in() {
		// Create a test user and log them in
		$user_id = self::factory()->user->create();
		wp_set_current_user($user_id);

		// Create a product post
		$post_id = self::factory()->post->create([
			'post_type'   => 'sc_product',
			'post_status' => 'publish',
			'post_title'  => 'Test Product',
			'meta_input'  => [
				'sc_id' => 'sc_test_product_456',
				'product' => [
					'id'         => 'sc_test_product_456',
					'name'       => 'Test Product',
				],
			],
		]);

		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn('sc_test_product_456');
		$request->shouldReceive('query')
			->with('context')
			->andReturn('customer.order.solicit_reviews');

		$response = $this->middleware->handle($request, function ($req) {
			return 'next_response';
		});

		$this->assertInstanceOf(RedirectResponse::class, $response, 'Should return RedirectResponse');

		// Get the redirect URL from the Location header
		$redirect_url = $response->getHeaderLine('Location');
		$this->assertStringContainsString('product-review-form=' . $post_id, $redirect_url, 'Redirect URL should contain product-review-form query parameter');
		$this->assertStringContainsString(get_permalink($post_id), $redirect_url, 'Redirect URL should contain product permalink');

		// Clean up
		wp_delete_post($post_id, true);
		wp_delete_user($user_id);
	}

	/**
	 * Test that middleware redirects to dashboard with redirect_to when user is not logged in.
	 */
	public function test_should_redirect_to_dashboard_with_redirect_to_when_not_logged_in() {
		// Ensure no user is logged in
		wp_set_current_user(0);

		// Create a product post
		$post_id = self::factory()->post->create([
			'post_type'   => 'sc_product',
			'post_status' => 'publish',
			'post_title'  => 'Test Product',
			'meta_input'  => [
				'sc_id' => 'sc_test_product_789',
				'product' => [
					'id'         => 'sc_test_product_789',
					'name'       => 'Test Product',
				],
			],
		]);

		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn('sc_test_product_789');
		$request->shouldReceive('query')
			->with('context')
			->andReturn('customer.order.solicit_reviews');

		$next = function ($req) {
			return 'next_response';
		};

		$response = $this->middleware->handle($request, $next);

		$this->assertInstanceOf(RedirectResponse::class, $response, 'Should return RedirectResponse');

		// Get the redirect URL from the Location header
		$redirect_url = $response->getHeaderLine('Location');
		$this->assertStringContainsString('redirect_to=', $redirect_url, 'Redirect URL should contain redirect_to parameter');

		// Parse the URL to check the redirect_to parameter
		$parsed_url = parse_url($redirect_url);
		parse_str($parsed_url['query'] ?? '', $query_params);

		$this->assertArrayHasKey('redirect_to', $query_params, 'Should have redirect_to query parameter');

		// Decode the redirect_to parameter and check it contains the product review form
		$redirect_to = rawurldecode($query_params['redirect_to']);
		$this->assertStringContainsString('product-review-form=' . $post_id, $redirect_to, 'redirect_to should contain product-review-form parameter');
	}

	/**
	 * Test that middleware handles correct context value.
	 */
	public function test_should_handle_correct_context() {
		// Create a test user and log them in
		$user_id = self::factory()->user->create([
			'user_login' => 'testuser2',
			'user_email' => 'test2@example.com',
		]);

		// Set the current user
		wp_set_current_user($user_id);

		// Create a product post
		self::factory()->post->create([
			'post_type'   => 'sc_product',
			'post_status' => 'publish',
			'post_title'  => 'Test Product 2',
			'meta_input'  => [
				'sc_id' => 'sc_test_product_context',
				'product' => [
					'id'         => 'sc_test_product_context',
					'name'       => 'Test Product 2',
				],
			],
		]);

		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')
			->with('product_id')
			->andReturn('sc_test_product_context');
		$request->shouldReceive('query')
			->with('context')
			->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next = function ($req) use (&$next_called) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle($request, $next);

		$this->assertFalse($next_called, 'Next middleware should not be called when context is correct');
		$this->assertInstanceOf(RedirectResponse::class, $response, 'Should return RedirectResponse for correct context');
	}
}
