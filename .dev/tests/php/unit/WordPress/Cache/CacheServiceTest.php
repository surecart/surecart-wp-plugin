<?php

namespace SureCart\Tests\Services;

use Mockery\MockInterface;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Cache\LiteSpeedCacheService;
use SureCart\WordPress\Cache\W3TotalCacheService;
use SureCart\WordPress\Cache\WpFastestCacheService;

/**
 * @group cache
 */
class CacheServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * The W3TC service instance.
	 *
	 * @var W3TotalCacheService
	 */
	protected $w3tc;

	/**
	 * The LiteSpeed service instance.
	 *
	 * @var LiteSpeedCacheService
	 */
	protected $litespeed;

	/**
	 * The WP Fastest Cache service instance.
	 *
	 * @var WpFastestCacheService
	 */
	protected $wpfastest;

	public function setUp(): void {
		parent::setUp();
		$this->w3tc      = new W3TotalCacheService();
		$this->litespeed = new LiteSpeedCacheService();
		$this->wpfastest = new WpFastestCacheService();
	}

	public function tearDown(): void {
		parent::tearDown();
		unset( $_SERVER['REQUEST_URI'] );
		unset( $_GET['rest_route'] );
	}

	/**
	 * Create a mock W3TC service with protected methods enabled.
	 *
	 * @return MockInterface|W3TotalCacheService
	 */
	protected function createW3TCMock() {
		return \Mockery::mock( W3TotalCacheService::class )->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Create a mock LiteSpeed service with protected methods enabled.
	 *
	 * @return MockInterface|LiteSpeedCacheService
	 */
	protected function createLiteSpeedMock() {
		return \Mockery::mock( LiteSpeedCacheService::class )->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Create a mock WP Fastest Cache service with protected methods enabled.
	 *
	 * @return MockInterface|WpFastestCacheService
	 */
	protected function createWpFastestCacheMock() {
		return \Mockery::mock( WpFastestCacheService::class )->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Test that maybeDisableCacheForRestApi disables cache for SureCart REST requests.
	 */
	public function test_disables_cache_for_surecart_rest_request() {
		$_SERVER['REQUEST_URI'] = '/wp-json/surecart/v1/products';

		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCachePluginActive' )->andReturn( true );
		$service->shouldReceive( 'disableCacheWithBrowserHeaders' )->once()->with( 'SureCart REST API request' );

		$service->maybeDisableCacheForRestApi();
	}

	/**
	 * Test that maybeDisableCacheForRestApi does not disable cache for non-SureCart REST requests.
	 */
	public function test_does_not_disable_cache_for_non_surecart_rest_request() {
		$_SERVER['REQUEST_URI'] = '/wp-json/wp/v2/posts';

		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCachePluginActive' )->andReturn( true );
		$service->shouldReceive( 'disableCacheWithBrowserHeaders' )->never();

		$service->maybeDisableCacheForRestApi();
	}

	/**
	 * Test that bootstrap does not register hooks when cache plugin is not active.
	 */
	public function test_does_not_disable_cache_when_plugin_not_active() {
		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCachePluginActive' )->andReturn( false );

		$service->bootstrap();

		$this->assertFalse( has_action( 'wp', [ $service, 'maybeDisableCache' ] ) );
		$this->assertFalse( has_action( 'rest_api_init', [ $service, 'maybeDisableCacheForRestApi' ] ) );
	}

	/**
	 * Test W3TC maybePreventCaching returns false when already not caching.
	 */
	public function test_w3tc_maybe_prevent_caching_returns_false_when_already_not_caching() {
		$this->assertFalse( $this->w3tc->maybePreventCaching( false ) );
	}

	/**
	 * Test W3TC excludeScriptsFromMinify returns early when already not minifying.
	 */
	public function test_w3tc_exclude_scripts_from_minify_returns_early_when_not_minifying() {
		$result = $this->w3tc->excludeScriptsFromMinify(
			false,
			'<script src="/wp-includes/js/dist/api-fetch.min.js"></script>',
			'/wp-includes/js/dist/api-fetch.min.js'
		);

		$this->assertFalse( $result );
	}

	/**
	 * Test W3TC excludeScriptsFromMinify returns false for excluded scripts.
	 */
	public function test_w3tc_exclude_scripts_from_minify_excludes_wp_api_fetch() {
		$result = $this->w3tc->excludeScriptsFromMinify(
			true,
			'<script src="/wp-includes/js/dist/api-fetch.min.js"></script>',
			'/wp-includes/js/dist/api-fetch.min.js'
		);

		$this->assertFalse( $result );
	}

	/**
	 * Test W3TC excludeScriptsFromMinify returns true for non-excluded scripts.
	 */
	public function test_w3tc_exclude_scripts_from_minify_allows_regular_scripts() {
		$result = $this->w3tc->excludeScriptsFromMinify(
			true,
			'<script src="/wp-content/plugins/some-plugin/script.js"></script>',
			'/wp-content/plugins/some-plugin/script.js'
		);

		$this->assertTrue( $result );
	}

	/**
	 * Test W3TC excludeScriptsFromDefer adds data-no-defer attribute for excluded scripts.
	 */
	public function test_w3tc_exclude_scripts_from_defer_adds_no_defer_attribute() {
		$script_tags = [
			'<script src="/wp-includes/js/dist/api-fetch.min.js"></script>',
			'<script src="/wp-content/plugins/some-plugin/script.js"></script>',
		];

		$result = $this->w3tc->excludeScriptsFromDefer( $script_tags );

		$this->assertStringContainsString( 'data-no-defer="1"', $result[0] );
		$this->assertStringNotContainsString( 'data-no-defer', $result[1] );
	}

	/**
	 * Test W3TC excludeScriptsFromDefer handles non-array input gracefully.
	 */
	public function test_w3tc_exclude_scripts_from_defer_handles_non_array() {
		$result = $this->w3tc->excludeScriptsFromDefer( 'not an array' );

		$this->assertEquals( 'not an array', $result );
	}

	/**
	 * Test LiteSpeed addVaryCookies adds SureCart cookies.
	 */
	public function test_litespeed_add_vary_cookies() {
		$result = $this->litespeed->addVaryCookies( [] );

		$this->assertContains( 'sc_checkout_id', $result );
		$this->assertContains( 'sc_customer_id', $result );
		$this->assertContains( 'sc_order_id', $result );
	}

	/**
	 * Test LiteSpeed addVaryCookies handles non-array input.
	 */
	public function test_litespeed_add_vary_cookies_handles_non_array() {
		$result = $this->litespeed->addVaryCookies( 'not an array' );

		$this->assertIsArray( $result );
		$this->assertContains( 'sc_checkout_id', $result );
	}

	/**
	 * Test LiteSpeed excludeScriptsFromDefer adds exclusions.
	 */
	public function test_litespeed_exclude_scripts_from_defer() {
		$result = $this->litespeed->excludeScriptsFromDefer( [] );

		$this->assertContains( 'wp-api-fetch', $result );
		$this->assertContains( 'wp-i18n', $result );
		$this->assertContains( 'wp-a11y', $result );
	}

	/**
	 * Test LiteSpeed excludeScriptsFromDefer handles non-array input.
	 */
	public function test_litespeed_exclude_scripts_from_defer_handles_non_array() {
		$result = $this->litespeed->excludeScriptsFromDefer( 'not an array' );

		$this->assertIsArray( $result );
		$this->assertContains( 'wp-api-fetch', $result );
	}

	/**
	 * Test shouldExcludeFromCache returns true when on customer dashboard page.
	 */
	public function test_should_exclude_from_cache_returns_true_for_customer_dashboard() {
		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( true );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( false );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( false );
		$service->shouldReceive( 'isBuyPage' )->andReturn( false );

		$this->assertTrue( $service->shouldExcludeFromCache() );
	}

	/**
	 * Test shouldExcludeFromCache returns true when on checkout page.
	 */
	public function test_should_exclude_from_cache_returns_true_for_checkout_page() {
		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( false );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( true );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( false );
		$service->shouldReceive( 'isBuyPage' )->andReturn( false );

		$this->assertTrue( $service->shouldExcludeFromCache() );
	}

	/**
	 * Test shouldExcludeFromCache returns true when page has checkout form block.
	 */
	public function test_should_exclude_from_cache_returns_true_for_checkout_form_block() {
		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( false );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( false );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( true );
		$service->shouldReceive( 'isBuyPage' )->andReturn( false );

		$this->assertTrue( $service->shouldExcludeFromCache() );
	}

	/**
	 * Test shouldExcludeFromCache returns true when on buy page.
	 */
	public function test_should_exclude_from_cache_returns_true_for_buy_page() {
		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( false );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( false );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( false );
		$service->shouldReceive( 'isBuyPage' )->andReturn( true );

		$this->assertTrue( $service->shouldExcludeFromCache() );
	}

	/**
	 * Test shouldExcludeFromCache returns false when on a regular page.
	 */
	public function test_should_exclude_from_cache_returns_false_for_regular_page() {
		$service = $this->createW3TCMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( false );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( false );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( false );
		$service->shouldReceive( 'isBuyPage' )->andReturn( false );

		$this->assertFalse( $service->shouldExcludeFromCache() );
	}

	/**
	 * Test WP Fastest Cache maybeDisableCacheForRestApi disables cache for SureCart REST requests.
	 */
	public function test_wpfastest_disables_cache_for_surecart_rest_request() {
		$_SERVER['REQUEST_URI'] = '/wp-json/surecart/v1/products';

		$service = $this->createWpFastestCacheMock();
		$service->shouldReceive( 'isCachePluginActive' )->andReturn( true );
		$service->shouldReceive( 'disableCacheWithBrowserHeaders' )->once()->with( 'SureCart REST API request' );

		$service->maybeDisableCacheForRestApi();
	}

	/**
	 * Test WP Fastest Cache bootstrap does not register hooks when plugin not active.
	 */
	public function test_wpfastest_does_not_disable_cache_when_plugin_not_active() {
		$service = $this->createWpFastestCacheMock();
		$service->shouldReceive( 'isCachePluginActive' )->andReturn( false );

		$service->bootstrap();

		$this->assertFalse( has_action( 'wp', [ $service, 'maybeDisableCache' ] ) );
		$this->assertFalse( has_action( 'rest_api_init', [ $service, 'maybeDisableCacheForRestApi' ] ) );
	}

	/**
	 * Test WP Fastest Cache shouldExcludeFromCache returns true for customer dashboard.
	 */
	public function test_wpfastest_should_exclude_from_cache_for_customer_dashboard() {
		$service = $this->createWpFastestCacheMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( true );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( false );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( false );
		$service->shouldReceive( 'isBuyPage' )->andReturn( false );

		$this->assertTrue( $service->shouldExcludeFromCache() );
	}

	/**
	 * Test WP Fastest Cache shouldExcludeFromCache returns false for regular page.
	 */
	public function test_wpfastest_should_exclude_from_cache_for_regular_page() {
		$service = $this->createWpFastestCacheMock();
		$service->shouldReceive( 'isCustomerDashboardPage' )->andReturn( false );
		$service->shouldReceive( 'isCheckoutPage' )->andReturn( false );
		$service->shouldReceive( 'hasCheckoutFormBlock' )->andReturn( false );
		$service->shouldReceive( 'isBuyPage' )->andReturn( false );

		$this->assertFalse( $service->shouldExcludeFromCache() );
	}
}
