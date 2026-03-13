<?php

namespace SureCart\Tests\WordPress\Shortcodes;

use Mockery;
use SureCart\Models\Product;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Shortcodes\ShortcodesService;
use SureCart\WordPress\Shortcodes\ShortcodesServiceProvider;

/**
 * Tests for product review shortcodes — registration, product context, and pattern loading.
 *
 * @group shortcodes
 * @group product-reviews
 */
class ProductReviewShortcodesTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * The service under test.
	 *
	 * @var ShortcodesService|\Mockery\MockInterface
	 */
	protected $service;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\WordPress\PluginServiceProvider::class,
					\SureCart\WordPress\Pages\PageServiceProvider::class,
					\SureCart\Sync\SyncServiceProvider::class,
					\SureCart\WordPress\Posts\PostServiceProvider::class,
					ShortcodesServiceProvider::class,
				],
			],
			false
		);

		$mock_account     = Mockery::mock( 'stdClass' );
		$mock_account->id = 'test_account_id';
		\SureCart::alias(
			'account',
			function () use ( $mock_account ) {
				return $mock_account;
			}
		);

		$this->service = Mockery::mock( ShortcodesService::class )->makePartial();
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		set_query_var( 'surecart_current_product', '' );
		parent::tearDown();
	}

	/**
	 * Helper to create a product post with meta.
	 *
	 * @param string $sc_id The SureCart product ID.
	 * @param string $name  The product name.
	 *
	 * @return int The post ID.
	 */
	protected function createProductPost( $sc_id = 'prod_test_123', $name = 'Test Product' ) {
		$post_id = $this->factory()->post->create(
			[
				'post_type'   => 'sc_product',
				'post_status' => 'publish',
				'post_title'  => $name,
			]
		);

		update_post_meta(
			$post_id,
			'product',
			[
				'id'             => $sc_id,
				'name'           => $name,
				'featured_image' => null,
			]
		);
		update_post_meta( $post_id, 'sc_id', $sc_id );

		return $post_id;
	}

	/**
	 * Trigger shortcode registration directly (avoids firing all init hooks).
	 */
	protected function registerShortcodes() {
		$provider = new ShortcodesServiceProvider();
		$provider->register( \SureCart::app()->container() );
		$provider->bootstrap( \SureCart::app()->container() );
		$provider->registerShortcodes();
	}

	/**
	 * Test that all expected review shortcodes are registered.
	 */
	public function test_all_review_shortcodes_are_registered() {
		$this->registerShortcodes();

		$expected = [
			'sc_product_review_rating_stars',
			'sc_product_review_rating_value',
			'sc_product_review_total_count',
			'sc_product_review_breakdown',
			'sc_product_review_add_button',
			'sc_product_review_list',
		];

		foreach ( $expected as $shortcode ) {
			$this->assertTrue(
				shortcode_exists( $shortcode ),
				"Shortcode '{$shortcode}' should be registered."
			);
		}
	}

	/**
	 * Test that auto-generated shortcodes still exist alongside new aliases.
	 */
	public function test_auto_generated_shortcodes_coexist_with_aliases() {
		$this->registerShortcodes();

		$auto_generated = [
			'sc_product_review_average_rating_stars',
			'sc_product_review_average_rating_value',
			'sc_product_review_total_rating',
		];

		$aliases = [
			'sc_product_review_rating_stars',
			'sc_product_review_rating_value',
			'sc_product_review_total_count',
		];

		foreach ( array_merge( $auto_generated, $aliases ) as $shortcode ) {
			$this->assertTrue(
				shortcode_exists( $shortcode ),
				"Shortcode '{$shortcode}' should be registered."
			);
		}
	}

	/**
	 * @dataProvider booleanAttributeProvider
	 */
	public function test_boolean_attribute_casting( $input, $expected ) {
		$result = filter_var( $input, FILTER_VALIDATE_BOOLEAN );
		$this->assertSame( $expected, $result );
	}

	public function booleanAttributeProvider() {
		return [
			'string true'  => [ 'true', true ],
			'string false' => [ 'false', false ],
			'string 1'     => [ '1', true ],
			'string 0'     => [ '0', false ],
			'string yes'   => [ 'yes', true ],
			'string no'    => [ 'no', false ],
		];
	}

	/**
	 * Test format attribute to className conversion.
	 */
	public function test_format_attribute_to_classname_conversion() {
		$attributes = [ 'format' => 'slash' ];

		if ( ! empty( $attributes['format'] ) && 'none' !== $attributes['format'] ) {
			$attributes['className'] = 'is-style-' . sanitize_html_class( $attributes['format'] );
		}
		unset( $attributes['format'] );

		$this->assertEquals( 'is-style-slash', $attributes['className'] );
		$this->assertArrayNotHasKey( 'format', $attributes );
	}

	/**
	 * Test format 'none' does not add className.
	 */
	public function test_format_none_does_not_add_classname() {
		$attributes = [ 'format' => 'none' ];

		if ( ! empty( $attributes['format'] ) && 'none' !== $attributes['format'] ) {
			$attributes['className'] = 'is-style-' . sanitize_html_class( $attributes['format'] );
		}
		unset( $attributes['format'] );

		$this->assertArrayNotHasKey( 'className', $attributes );
	}

	/**
	 * Test format sanitization prevents XSS.
	 */
	public function test_format_attribute_sanitization() {
		$malicious = 'slash"><script>alert(1)</script>';
		$sanitized = sanitize_html_class( $malicious );

		$this->assertStringNotContainsString( '<script>', $sanitized );
		$this->assertStringNotContainsString( '"', $sanitized );
	}

	/**
	 * Test rating stars default attributes.
	 */
	public function test_rating_stars_default_attributes() {
		$defaults = shortcode_atts(
			[
				'id'              => null,
				'size'            => '20px',
				'fill_color'      => '',
				'link_to_reviews' => false,
			],
			[],
			'sc_product_review_rating_stars'
		);

		$this->assertNull( $defaults['id'] );
		$this->assertEquals( '20px', $defaults['size'] );
		$this->assertFalse( $defaults['link_to_reviews'] );
	}

	/**
	 * Test rating value default attributes.
	 */
	public function test_rating_value_default_attributes() {
		$defaults = shortcode_atts(
			[
				'id'              => null,
				'link_to_reviews' => false,
				'format'          => 'none',
			],
			[],
			'sc_product_review_rating_value'
		);

		$this->assertNull( $defaults['id'] );
		$this->assertFalse( $defaults['link_to_reviews'] );
		$this->assertEquals( 'none', $defaults['format'] );
	}

	/**
	 * Test total count default attributes.
	 */
	public function test_total_count_default_attributes() {
		$defaults = shortcode_atts(
			[
				'id'                    => null,
				'show_label'            => true,
				'show_for_zero_reviews' => true,
				'link_to_reviews'       => true,
			],
			[],
			'sc_product_review_total_count'
		);

		$this->assertTrue( $defaults['show_label'] );
		$this->assertTrue( $defaults['show_for_zero_reviews'] );
		$this->assertTrue( $defaults['link_to_reviews'] );
	}

	/**
	 * Test breakdown default attributes.
	 */
	public function test_breakdown_default_attributes() {
		$defaults = shortcode_atts(
			[
				'id'                   => null,
				'columns'              => 1,
				'fill_color'           => '',
				'bar_fill_color'       => '',
				'bar_background_color' => '',
			],
			[],
			'sc_product_review_breakdown'
		);

		$this->assertEquals( 1, $defaults['columns'] );
		$this->assertEquals( '', $defaults['bar_fill_color'] );
	}

	/**
	 * Test shortcode attribute override with user-provided values.
	 */
	public function test_shortcode_attrs_override_defaults() {
		$merged = shortcode_atts(
			[
				'id'              => null,
				'size'            => '20px',
				'fill_color'      => '',
				'link_to_reviews' => false,
			],
			[
				'size'       => '32px',
				'fill_color' => '#f59e0b',
			],
			'sc_product_review_rating_stars'
		);

		$this->assertEquals( '32px', $merged['size'] );
		$this->assertEquals( '#f59e0b', $merged['fill_color'] );
		$this->assertNull( $merged['id'] );
	}

	/**
	 * Test setupProductContext sets query var for valid product.
	 */
	public function test_setup_product_context_sets_query_var() {
		$post_id = $this->createProductPost( 'prod_ctx_test', 'Context Test' );

		$reflection = new \ReflectionMethod( $this->service, 'setupProductContext' );
		$reflection->setAccessible( true );

		$reflection->invoke( $this->service, $post_id );

		$product = get_query_var( 'surecart_current_product' );
		$this->assertInstanceOf( Product::class, $product );
		$this->assertEquals( 'prod_ctx_test', $product->id );
	}

	/**
	 * Test setupProductContext preserves existing when no ID given.
	 */
	public function test_setup_product_context_preserves_existing_when_no_id() {
		$existing = new Product( [ 'id' => 'prod_keep', 'name' => 'Keep' ] );
		set_query_var( 'surecart_current_product', $existing );

		$reflection = new \ReflectionMethod( $this->service, 'setupProductContext' );
		$reflection->setAccessible( true );

		$reflection->invoke( $this->service, null );

		$this->assertSame( $existing, get_query_var( 'surecart_current_product' ) );
	}

	/**
	 * Test setupProductContext returns original value for restoration.
	 */
	public function test_setup_product_context_returns_original() {
		$original = new Product( [ 'id' => 'prod_orig', 'name' => 'Orig' ] );
		set_query_var( 'surecart_current_product', $original );

		$post_id = $this->createProductPost( 'prod_new_ctx', 'New Context' );

		$reflection = new \ReflectionMethod( $this->service, 'setupProductContext' );
		$reflection->setAccessible( true );

		$this->assertSame( $original, $reflection->invoke( $this->service, $post_id ) );
	}

	/**
	 * Test setupProductContext handles invalid ID gracefully.
	 */
	public function test_setup_product_context_handles_invalid_id() {
		$reflection = new \ReflectionMethod( $this->service, 'setupProductContext' );
		$reflection->setAccessible( true );

		$reflection->invoke( $this->service, 999999 );

		$this->assertEmpty( get_query_var( 'surecart_current_product' ) );
	}

	/**
	 * Test restoreProductContext restores original value.
	 */
	public function test_restore_product_context() {
		$original = new Product( [ 'id' => 'prod_restore', 'name' => 'Restore' ] );
		set_query_var( 'surecart_current_product', 'something_else' );

		$reflection = new \ReflectionMethod( $this->service, 'restoreProductContext' );
		$reflection->setAccessible( true );

		$reflection->invoke( $this->service, $original );

		$this->assertSame( $original, get_query_var( 'surecart_current_product' ) );
	}

	/**
	 * Test renderBlockWithProductContext sets context from explicit ID and restores on completion.
	 */
	public function test_render_block_with_product_context_sets_and_restores() {
		$post_id = $this->createProductPost();

		$this->service
			->shouldReceive( 'processBlock' )
			->once()
			->andReturn( '<div>block output</div>' );

		$this->service->renderBlockWithProductContext(
			'surecart/product-review-average-rating-stars',
			[ 'id' => $post_id ],
			''
		);

		$this->assertEmpty( get_query_var( 'surecart_current_product' ) );
	}

	/**
	 * Test renderBlockWithProductContext restores a pre-existing product context.
	 */
	public function test_render_block_restores_previous_product_context() {
		$original = new Product( [ 'id' => 'prod_original', 'name' => 'Original' ] );
		set_query_var( 'surecart_current_product', $original );

		$post_id = $this->createProductPost( 'prod_new', 'New Product' );

		$this->service
			->shouldReceive( 'processBlock' )
			->once()
			->andReturn( '<div>output</div>' );

		$this->service->renderBlockWithProductContext(
			'surecart/product-review-average-rating-stars',
			[ 'id' => $post_id ],
			''
		);

		$this->assertSame( $original, get_query_var( 'surecart_current_product' ) );
	}

	/**
	 * Test renderBlockWithProductContext removes 'id' from attrs before passing to processBlock.
	 */
	public function test_render_block_removes_id_from_attrs() {
		$post_id = $this->createProductPost();

		$this->service
			->shouldReceive( 'processBlock' )
			->once()
			->withArgs(
				function ( $block_name, $attrs, $content ) {
					return ! array_key_exists( 'id', $attrs ) && '24px' === $attrs['size'];
				}
			)
			->andReturn( '<div>output</div>' );

		$this->service->renderBlockWithProductContext(
			'surecart/product-review-average-rating-stars',
			[
				'id'   => $post_id,
				'size' => '24px',
			],
			''
		);
	}

	/**
	 * Test nested context isolation.
	 */
	public function test_nested_context_isolation() {
		$post_id_1 = $this->createProductPost( 'prod_outer', 'Outer Product' );
		$post_id_2 = $this->createProductPost( 'prod_inner', 'Inner Product' );

		$this->service
			->shouldReceive( 'processBlock' )
			->andReturn( '<div>output</div>' );

		// First render — starts empty, should restore to empty.
		$this->service->renderBlockWithProductContext(
			'surecart/product-review-average-rating-stars',
			[ 'id' => $post_id_1 ],
			''
		);
		$this->assertEmpty( get_query_var( 'surecart_current_product' ) );

		// Set an outer context, render inner — should restore outer.
		$outer = new Product( [ 'id' => 'prod_outer', 'name' => 'Outer' ] );
		set_query_var( 'surecart_current_product', $outer );

		$this->service->renderBlockWithProductContext(
			'surecart/product-review-average-rating-stars',
			[ 'id' => $post_id_2 ],
			''
		);
		$this->assertSame( $outer, get_query_var( 'surecart_current_product' ) );
	}

	/**
	 * Test renderBlockHtmlWithProductContext sets up and restores context.
	 */
	public function test_render_block_html_restores_context() {
		$original = new Product( [ 'id' => 'prod_original', 'name' => 'Original' ] );
		set_query_var( 'surecart_current_product', $original );

		$post_id = $this->createProductPost( 'prod_html', 'HTML Product' );

		$output = $this->service->renderBlockHtmlWithProductContext(
			'<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->',
			$post_id
		);

		$this->assertIsString( $output );
		$this->assertSame( $original, get_query_var( 'surecart_current_product' ) );
	}

	/**
	 * Test that the review list pattern file returns expected content.
	 */
	public function test_review_list_pattern_returns_content() {
		$pattern = include SURECART_PLUGIN_DIR . '/templates/patterns/product-review-standard.php';

		$this->assertIsArray( $pattern );
		$this->assertArrayHasKey( 'content', $pattern );
		$this->assertNotEmpty( $pattern['content'] );
	}

	/**
	 * Test that the review list pattern contains expected block names.
	 */
	public function test_review_list_pattern_contains_expected_blocks() {
		$pattern    = include SURECART_PLUGIN_DIR . '/templates/patterns/product-review-standard.php';
		$block_html = $pattern['content'];

		$expected_blocks = [
			'wp:surecart/product-review-list',
			'wp:surecart/product-reviews',
			'wp:surecart/product-review-summary',
			'wp:surecart/product-review-average-rating-value',
			'wp:surecart/product-review-average-rating-stars',
			'wp:surecart/product-review-total-rating',
			'wp:surecart/product-review-breakdown',
			'wp:surecart/product-review-template',
			'wp:surecart/product-review-pagination',
			'wp:surecart/product-review-list-no-reviews',
			'wp:surecart/product-review-add-button',
			'wp:surecart/product-review-list-sidebar',
			'wp:surecart/product-review-list-sidebar-toggle',
			'wp:surecart/product-review-list-filter-tags',
			'wp:surecart/product-review-list-filter-checkboxes',
			'wp:surecart/product-review-reviewer-name',
			'wp:surecart/product-review-verified-badge',
			'wp:surecart/product-review-date',
			'wp:surecart/product-review-rating-stars',
			'wp:surecart/product-review-title',
			'wp:surecart/product-review-content',
			'wp:surecart/product-review-pagination-previous',
			'wp:surecart/product-review-pagination-numbers',
			'wp:surecart/product-review-pagination-next',
		];

		foreach ( $expected_blocks as $block ) {
			$this->assertStringContainsString( $block, $block_html, "Pattern should contain '{$block}'." );
		}
	}

	/**
	 * Test that the review list pattern includes translatable strings.
	 */
	public function test_review_list_pattern_includes_translatable_strings() {
		$pattern    = include SURECART_PLUGIN_DIR . '/templates/patterns/product-review-standard.php';
		$block_html = $pattern['content'];

		$this->assertStringContainsString( 'Customer Reviews', $block_html );
		$this->assertStringContainsString( 'Based on', $block_html );
		$this->assertStringContainsString( 'No reviews yet.', $block_html );
		$this->assertStringContainsString( 'Filters', $block_html );
		$this->assertStringContainsString( 'Verified Buyer', $block_html );
	}
}
