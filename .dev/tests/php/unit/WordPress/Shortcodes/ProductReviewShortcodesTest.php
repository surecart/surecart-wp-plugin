<?php

namespace SureCart\Tests\WordPress\Shortcodes;

use Mockery;
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
}
