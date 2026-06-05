<?php

namespace SureCart\Tests\WordPress\Shortcodes;

use Mockery;
use SureCart\Models\Product;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Shortcodes\ShortcodesServiceProvider;

/**
 * Tests for product review shortcodes — registration and pattern loading.
 *
 * @group shortcodes
 * @group product-reviews
 */
class ProductReviewShortcodesTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

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

	/**
	 * Seed an `sc_product` post that `sc_get_product()` can resolve by sc_id.
	 */
	protected function seedProductPost( string $sc_id ): int {
		$post_id = $this->factory()->post->create( [ 'post_type' => 'sc_product' ] );
		update_post_meta( $post_id, 'sc_id', $sc_id );
		update_post_meta(
			$post_id,
			'product',
			wp_json_encode( [ 'id' => $sc_id, 'name' => 'Test ' . $sc_id ] )
		);
		return $post_id;
	}

	/**
	 * With `product_id`, the review shortcode renders within that product's context
	 * and the query var is restored to its previous value afterward.
	 *
	 * @group product-reviews-product-id
	 */
	public function test_product_id_sets_and_restores_product_context() {
		$sc_id = 'prod_review_context';
		$this->seedProductPost( $sc_id );
		$this->registerShortcodes();

		$captured = null;
		add_filter(
			'shortcode_atts_sc_product_review_rating_stars',
			function ( $attrs ) use ( &$captured ) {
				$captured = [
					'attrs'   => $attrs,
					'product' => get_query_var( 'surecart_current_product' ),
				];
				return $attrs;
			}
		);

		do_shortcode( '[sc_product_review_rating_stars product_id="' . $sc_id . '" size="24px"]' );

		$this->assertIsArray( $captured, 'The shortcode body should have run.' );
		$this->assertArrayNotHasKey( 'product_id', $captured['attrs'], 'product_id must be stripped before the block sees attrs.' );
		$this->assertSame( '24px', $captured['attrs']['size'] ?? null, 'Other attrs pass through unchanged.' );
		$this->assertSame( $sc_id, $captured['product']->id ?? null, 'Product context is set during render.' );
		$this->assertEmpty( get_query_var( 'surecart_current_product' ), 'Query var is restored after render.' );
	}

	/**
	 * An unresolved `product_id` renders empty rather than silently showing the
	 * surrounding page's product.
	 *
	 * @group product-reviews-product-id
	 */
	public function test_unresolved_product_id_renders_empty() {
		$this->registerShortcodes();

		$ran = false;
		add_filter(
			'shortcode_atts_sc_product_review_rating_stars',
			function ( $attrs ) use ( &$ran ) {
				$ran = true;
				return $attrs;
			}
		);

		$output = do_shortcode( '[sc_product_review_rating_stars product_id="prod_does_not_exist"]' );

		$this->assertFalse( $ran, 'The shortcode body must not run when product_id is unresolved.' );
		$this->assertSame( '', $output );
	}

	/**
	 * Without `supports_product_id` the wrapper returns the original callback
	 * unchanged — scope guard for the deliberate decision to keep this an
	 * embed-anywhere escape hatch limited to review shortcodes for now.
	 *
	 * @group product-reviews-product-id
	 */
	public function test_wrapper_passes_through_when_not_opted_in() {
		$wrapper  = new \SureCart\WordPress\Shortcodes\ProductContextShortcodeWrapper();
		$original = function ( $attrs, $content ) {
			return 'rendered';
		};

		$wrapped = $wrapper->maybeWrap( $original, 'sc_anything', [] );

		$this->assertSame( $original, $wrapped, 'maybeWrap must pass through when supports_product_id is not set.' );
	}

	/**
	 * The previous query var value is restored after the renderer runs, so an
	 * outer product context (e.g. when the shortcode is used inside a product
	 * wrapper) is not clobbered.
	 *
	 * @group product-reviews-product-id
	 */
	public function test_outer_product_context_is_restored_after_render() {
		$inner_sc_id = 'prod_inner_context';
		$this->seedProductPost( $inner_sc_id );

		$outer_product = new Product( (object) [ 'id' => 'prod_outer_context' ] );
		set_query_var( 'surecart_current_product', $outer_product );

		$this->registerShortcodes();

		do_shortcode( '[sc_product_review_rating_stars product_id="' . $inner_sc_id . '"]' );

		$restored = get_query_var( 'surecart_current_product' );
		$this->assertSame( 'prod_outer_context', $restored->id ?? null, 'Outer product context must be restored.' );

		set_query_var( 'surecart_current_product', '' );
	}

	/**
	 * `id` is accepted as an alias for `product_id` on review shortcodes, so the
	 * same identifier name works across every product shortcode.
	 *
	 * @group product-reviews-product-id
	 */
	public function test_id_alias_sets_product_context_on_review_shortcode() {
		$sc_id = 'prod_review_id_alias';
		$this->seedProductPost( $sc_id );
		$this->registerShortcodes();

		$captured = null;
		add_filter(
			'shortcode_atts_sc_product_review_rating_stars',
			function ( $attrs ) use ( &$captured ) {
				$captured = [
					'attrs'   => $attrs,
					'product' => get_query_var( 'surecart_current_product' ),
				];
				return $attrs;
			}
		);

		do_shortcode( '[sc_product_review_rating_stars id="' . $sc_id . '" size="24px"]' );

		$this->assertIsArray( $captured, 'The shortcode body should have run.' );
		$this->assertArrayNotHasKey( 'id', $captured['attrs'], 'id must be stripped before the block sees attrs.' );
		$this->assertArrayNotHasKey( 'product_id', $captured['attrs'], 'product_id must be stripped before the block sees attrs.' );
		$this->assertSame( '24px', $captured['attrs']['size'] ?? null, 'Other attrs pass through unchanged.' );
		$this->assertSame( $sc_id, $captured['product']->id ?? null, 'Product context is set from the id alias.' );
		$this->assertEmpty( get_query_var( 'surecart_current_product' ), 'Query var is restored after render.' );
	}

	/**
	 * When both `product_id` and `id` are supplied to a review shortcode,
	 * `product_id` wins.
	 *
	 * @group product-reviews-product-id
	 */
	public function test_product_id_wins_over_id_alias() {
		$this->seedProductPost( 'prod_canonical' );
		$this->seedProductPost( 'prod_alias' );
		$this->registerShortcodes();

		$captured = null;
		add_filter(
			'shortcode_atts_sc_product_review_rating_stars',
			function ( $attrs ) use ( &$captured ) {
				$captured = get_query_var( 'surecart_current_product' );
				return $attrs;
			}
		);

		do_shortcode( '[sc_product_review_rating_stars product_id="prod_canonical" id="prod_alias"]' );

		$this->assertSame( 'prod_canonical', $captured->id ?? null, 'product_id takes precedence over the id alias.' );
	}

	/**
	 * Product (non-review) shortcodes accept `product_id` as an alias for `id`,
	 * normalized to the canonical `id` before the block renders.
	 *
	 * @group product-reviews-product-id
	 */
	public function test_product_shortcode_accepts_product_id_alias_for_id() {
		$service = new \SureCart\WordPress\Shortcodes\ShortcodesService();
		$service->registerBlockShortcodeByName( 'sc_test_product_alias', 'surecart/product-fake-test', [ 'id' => null ] );

		$captured = null;
		add_filter(
			'shortcode_atts_sc_test_product_alias',
			function ( $attrs ) use ( &$captured ) {
				$captured = $attrs;
				return $attrs;
			}
		);

		do_shortcode( '[sc_test_product_alias product_id="prod_alias_value"]' );

		$this->assertIsArray( $captured, 'The shortcode body should have run.' );
		$this->assertSame( 'prod_alias_value', $captured['id'] ?? null, 'product_id is mapped to the canonical id.' );
		$this->assertArrayNotHasKey( 'product_id', $captured, 'product_id is removed after aliasing.' );
	}
}
