<?php

namespace SureCart\Tests\Models\Blocks;

use SureCart\Models\Blocks\AbstractProductListBlock;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Concrete subclass to expose protected methods for testing.
 */
class TestableProductListBlock extends AbstractProductListBlock {
	/**
	 * Override constructor to skip WP_Block dependency.
	 */
	public function __construct() {}

	/**
	 * Expose collectGalleryAttachmentIds for testing.
	 *
	 * @param \WP_Post[] $posts The posts.
	 * @return int[]
	 */
	public function testCollectGalleryAttachmentIds( array $posts ) {
		return $this->collectGalleryAttachmentIds( $posts );
	}
}

/**
 * Tests for AbstractProductListBlock::collectGalleryAttachmentIds().
 *
 * Only tests the SureCart-specific gallery ID extraction logic.
 * Cache warming is delegated to WordPress core's _prime_post_caches().
 *
 * @group product-list-cache
 */
class AbstractProductListBlockCachePrimerTest extends SureCartUnitTestCase {
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
				],
			],
			false
		);

		\SureCart::alias(
			'account',
			function () {
				return (object) [ 'id' => 'test-account-id' ];
			}
		);
	}

	/**
	 * Test returns empty array when posts have no product metadata.
	 */
	public function test_collect_gallery_ids_returns_empty_when_no_product_data() {
		$block = $this->createTestableBlock();
		$post  = self::factory()->post->create_and_get();

		$this->assertSame( [], $block->testCollectGalleryAttachmentIds( [ $post ] ) );
	}

	/**
	 * Test extracts numeric IDs and skips non-numeric UUIDs.
	 */
	public function test_collect_gallery_ids_extracts_numeric_and_skips_uuids() {
		$block = $this->createTestableBlock();
		$post  = self::factory()->post->create_and_get();

		update_post_meta(
			$post->ID,
			'product',
			[
				'metadata' => [
					'gallery_ids' => [ 10, 'media-uuid-123', [ 'id' => 20 ], 30 ],
				],
			]
		);

		$result = $block->testCollectGalleryAttachmentIds( [ $post ] );

		$this->assertCount( 3, $result );
		$this->assertContains( 10, $result );
		$this->assertContains( 20, $result );
		$this->assertContains( 30, $result );
	}

	/**
	 * Test handles JSON-encoded product data and gallery_ids strings.
	 */
	public function test_collect_gallery_ids_handles_json_encoded_data() {
		$block = $this->createTestableBlock();
		$post  = self::factory()->post->create_and_get();

		update_post_meta(
			$post->ID,
			'product',
			wp_json_encode(
				[
					'metadata' => [
						'gallery_ids' => [ 5, (object) [ 'id' => 25 ] ],
					],
				]
			)
		);

		$result = $block->testCollectGalleryAttachmentIds( [ $post ] );

		$this->assertCount( 2, $result );
		$this->assertContains( 5, $result );
		$this->assertContains( 25, $result );
	}

	/**
	 * Test gathers IDs across multiple posts.
	 */
	public function test_collect_gallery_ids_from_multiple_posts() {
		$block = $this->createTestableBlock();
		$post1 = self::factory()->post->create_and_get();
		$post2 = self::factory()->post->create_and_get();

		update_post_meta( $post1->ID, 'product', [ 'metadata' => [ 'gallery_ids' => [ 10, 20 ] ] ] );
		update_post_meta( $post2->ID, 'product', [ 'metadata' => [ 'gallery_ids' => [ 30 ] ] ] );

		$result = $block->testCollectGalleryAttachmentIds( [ $post1, $post2 ] );

		$this->assertCount( 3, $result );
		$this->assertContains( 10, $result );
		$this->assertContains( 20, $result );
		$this->assertContains( 30, $result );
	}

	/**
	 * Helper to create a TestableProductListBlock instance.
	 *
	 * @return TestableProductListBlock
	 */
	private function createTestableBlock(): TestableProductListBlock {
		return new TestableProductListBlock();
	}
}
