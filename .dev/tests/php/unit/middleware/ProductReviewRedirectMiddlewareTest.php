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

		$this->middleware = new ProductReviewRedirectMiddleware( \SureCart::responses() );
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
		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn( null );
		$request->shouldReceive('query')->with('context')->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next        = function ( $req ) use ( &$next_called ) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle( $request, $next );

		$this->assertTrue( $next_called );
		$this->assertSame( 'next_response', $response );
	}

	/**
	 * Test that middleware passes to next when context is missing.
	 */
	public function test_should_pass_to_next_when_context_is_missing() {
		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn( '123' );
		$request->shouldReceive('query')->with('context')->andReturn( null );

		$next_called = false;
		$next        = function ( $req ) use ( &$next_called ) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle( $request, $next );

		$this->assertTrue( $next_called );
		$this->assertSame( 'next_response', $response );
	}

	/**
	 * Test that middleware passes to next when context is incorrect.
	 */
	public function test_should_pass_to_next_when_context_is_incorrect() {
		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn( '123' );
		$request->shouldReceive('query')->with('context')->andReturn('some.other.context');

		$next_called = false;
		$next        = function ( $req ) use ( &$next_called ) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle( $request, $next );

		$this->assertTrue( $next_called );
		$this->assertSame( 'next_response', $response );
	}

	/**
	 * Test that middleware passes to next when product doesn't exist.
	 */
	public function test_should_pass_to_next_when_product_does_not_exist() {
		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn( '999999' );
		$request->shouldReceive('query')->with('context')->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next        = function ( $req ) use ( &$next_called ) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle( $request, $next );

		$this->assertTrue( $next_called );
		$this->assertSame( 'next_response', $response );
	}

	/**
	 * Test that middleware passes to next when product has no post.
	 */
	public function test_should_pass_to_next_when_product_has_no_post() {
		self::factory()->post->create([
			'post_type'   => 'sc_product',
			'post_status' => 'trash',
			'post_title'  => 'Test Product',
			'meta_input'  => [
				'sc_id'   => 'sc_test_product_123',
				'product' => [
					'id'   => 'sc_test_product_123',
					'name' => 'Test Product',
				],
			],
		]);

		$request = Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')->with('product_id')->andReturn('sc_test_product_123');
		$request->shouldReceive('query')->with('context')->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next        = function ( $req ) use ( &$next_called ) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle( $request, $next );

		$this->assertTrue( $next_called );
		$this->assertSame( 'next_response', $response );
	}

	/**
	 * Test that middleware passes to next when product is not published and user cannot edit.
	 */
	public function test_should_pass_to_next_when_product_is_not_published_and_user_cannot_edit() {
		// Create a regular user without edit_sc_products capability.
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );

		self::factory()->post->create([
			'post_type'   => 'sc_product',
			'post_status' => 'draft',
			'post_title'  => 'Test Draft Product',
			'meta_input'  => [
				'sc_id'   => 'sc_test_product_draft',
				'product' => [
					'id'   => 'sc_test_product_draft',
					'name' => 'Test Draft Product',
				],
			],
		]);

		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn('sc_test_product_draft');
		$request->shouldReceive('query')->with('context')->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next        = function ( $req ) use ( &$next_called ) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle( $request, $next );

		$this->assertTrue( $next_called );
		$this->assertSame( 'next_response', $response );
	}

	/**
	 * Test that middleware redirects to product review page when user is logged in.
	 */
	public function test_should_redirect_to_product_review_page_when_logged_in() {
		wp_set_current_user( self::factory()->user->create() );

		$post_id = self::factory()->post->create([
			'post_type'  => 'sc_product',
			'post_status' => 'publish',
			'meta_input' => [
				'sc_id'   => 'sc_test_product_456',
				'product' => [
					'id'   => 'sc_test_product_456',
					'name' => 'Test Product',
				],
			],
		]);

		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn('sc_test_product_456');
		$request->shouldReceive('query')->with('context')->andReturn('customer.order.solicit_reviews');

		$response = $this->middleware->handle( $request, fn( $req ) => 'next_response' );

		$this->assertInstanceOf( RedirectResponse::class, $response );

		$redirect_url = $response->getHeaderLine( 'Location' );
		$this->assertStringContainsString( 'product-review-form=' . $post_id, $redirect_url );
		$this->assertStringContainsString( get_permalink( $post_id ), $redirect_url );
	}

	/**
	 * Test that middleware redirects to dashboard with redirect_to when user is not logged in.
	 */
	public function test_should_redirect_to_dashboard_with_redirect_to_when_not_logged_in() {
		wp_set_current_user( 0 );

		$post_id = self::factory()->post->create([
			'post_type'  => 'sc_product',
			'post_status' => 'publish',
			'meta_input' => [
				'sc_id'   => 'sc_test_product_789',
				'product' => [
					'id'   => 'sc_test_product_789',
					'name' => 'Test Product',
				],
			],
		]);

		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn('sc_test_product_789');
		$request->shouldReceive('query')->with('context')->andReturn('customer.order.solicit_reviews');

		$response = $this->middleware->handle( $request, fn( $req ) => 'next_response' );

		$this->assertInstanceOf( RedirectResponse::class, $response );

		$redirect_url = $response->getHeaderLine( 'Location' );
		$this->assertStringContainsString( 'redirect_to=', $redirect_url );

		$parsed_url = parse_url( $redirect_url );
		parse_str( $parsed_url['query'] ?? '', $query_params );

		$this->assertArrayHasKey( 'redirect_to', $query_params );
		$this->assertStringContainsString( 'product-review-form=' . $post_id, rawurldecode( $query_params['redirect_to'] ) );
	}

	/**
	 * Test that middleware handles correct context value.
	 */
	public function test_should_handle_correct_context() {
		wp_set_current_user( self::factory()->user->create() );

		self::factory()->post->create([
			'post_type'  => 'sc_product',
			'post_status' => 'publish',
			'meta_input' => [
				'sc_id'   => 'sc_test_product_context',
				'product' => [
					'id'   => 'sc_test_product_context',
					'name' => 'Test Product',
				],
			],
		]);

		$request = Mockery::mock( RequestInterface::class );
		$request->shouldReceive('query')->with('product_id')->andReturn('sc_test_product_context');
		$request->shouldReceive('query')->with('context')->andReturn('customer.order.solicit_reviews');

		$next_called = false;
		$next        = function ( $req ) use ( &$next_called ) {
			$next_called = true;
			return 'next_response';
		};

		$response = $this->middleware->handle( $request, $next );

		$this->assertFalse( $next_called );
		$this->assertInstanceOf( RedirectResponse::class, $response );
	}
}
