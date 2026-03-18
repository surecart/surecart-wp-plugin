<?php

namespace SureCart\Tests\WordPress\PostTypes;

use SureCart\WordPress\PostTypes\ProductAttachmentsCachePrimerService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Tests for ProductAttachmentsCachePrimerService.
 *
 * @group product-list-cache
 */
class ProductAttachmentsCachePrimerServiceTest extends SureCartUnitTestCase {

	/**
	 * The service instance under test.
	 *
	 * @var ProductAttachmentsCachePrimerService
	 */
	private $primer;

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

		// Mock account to prevent CollectionTaxonomyService errors during post creation.
		\SureCart::alias(
			'account',
			function () {
				return (object) [ 'id' => 'test-account-id' ];
			}
		);

		// Fresh instance per test to reset primed_ids state.
		$this->primer = new ProductAttachmentsCachePrimerService();
	}


	/**
	 * Test extractNumericId returns int for plain numeric value.
	 */
	public function test_extract_numeric_id_from_integer() {
		$this->assertSame( 42, $this->primer->extractNumericId( 42 ) );
	}

	/**
	 * Test extractNumericId returns int for numeric string.
	 */
	public function test_extract_numeric_id_from_string() {
		$this->assertSame( 42, $this->primer->extractNumericId( '42' ) );
	}

	/**
	 * Test extractNumericId returns int from array with 'id' key.
	 */
	public function test_extract_numeric_id_from_array() {
		$this->assertSame( 99, $this->primer->extractNumericId( [ 'id' => 99 ] ) );
	}

	/**
	 * Test extractNumericId returns int from object with 'id' property.
	 */
	public function test_extract_numeric_id_from_object() {
		$this->assertSame( 55, $this->primer->extractNumericId( (object) [ 'id' => 55 ] ) );
	}

	/**
	 * Test extractNumericId returns null for non-numeric string (ProductMedia ID).
	 */
	public function test_extract_numeric_id_returns_null_for_product_media_id() {
		$this->assertNull( $this->primer->extractNumericId( 'abc-123-media-id' ) );
	}

	/**
	 * Test extractNumericId returns null for array with non-numeric id.
	 */
	public function test_extract_numeric_id_returns_null_for_array_with_string_id() {
		$this->assertNull( $this->primer->extractNumericId( [ 'id' => 'media-uuid' ] ) );
	}

	/**
	 * Test getGalleryIdsFromPost returns empty array when no product data.
	 */
	public function test_get_gallery_ids_returns_empty_when_no_product_data() {
		$post = self::factory()->post->create_and_get();

		$this->assertSame( [], $this->primer->getGalleryIdsFromPost( $post ) );
	}

	/**
	 * Test getGalleryIdsFromPost parses gallery_ids from array product data.
	 */
	public function test_get_gallery_ids_parses_product_data() {
		$post = self::factory()->post->create_and_get();

		// Store as array — matches how product sync stores data in WP.
		update_post_meta(
			$post->ID,
			'product',
			[
				'metadata' => [
					'gallery_ids' => [ 10, 20, 'media-uuid' ],
				],
			]
		);

		$result = $this->primer->getGalleryIdsFromPost( $post );

		$this->assertCount( 3, $result );
		$this->assertEquals( 10, $result[0] );
		$this->assertEquals( 20, $result[1] );
		$this->assertEquals( 'media-uuid', $result[2] );
	}

	/**
	 * Test getGalleryIdsFromPost handles gallery items with nested id objects.
	 */
	public function test_get_gallery_ids_handles_nested_id_objects() {
		$post = self::factory()->post->create_and_get();

		// Store as array with nested objects (json_decode converts arrays to stdClass).
		update_post_meta(
			$post->ID,
			'product',
			[
				'metadata' => [
					'gallery_ids' => [ 5, [ 'id' => 15 ] ],
				],
			]
		);

		$result = $this->primer->getGalleryIdsFromPost( $post );

		$this->assertCount( 2, $result );
		$this->assertEquals( 5, $result[0] );
		// After json_decode(wp_json_encode()), nested arrays become stdClass.
		$this->assertEquals( 15, $result[1]->id );
	}

	/**
	 * Test collectImagePostIds gathers thumbnail and gallery IDs.
	 */
	public function test_collect_image_post_ids_gathers_all_ids() {
		$post1 = self::factory()->post->create_and_get();
		$post2 = self::factory()->post->create_and_get();

		// Post 1: thumbnail + gallery with mixed formats.
		update_post_meta( $post1->ID, '_thumbnail_id', '100' );
		update_post_meta(
			$post1->ID,
			'product',
			[
				'metadata' => [
					'gallery_ids' => [ 200, [ 'id' => 300 ], 'media-skip-me' ],
				],
			]
		);

		// Post 2: only thumbnail, no gallery.
		update_post_meta( $post2->ID, '_thumbnail_id', '400' );

		$result = $this->primer->collectImagePostIds( [ $post1, $post2 ] );

		$this->assertContains( 100, $result );
		$this->assertContains( 200, $result );
		$this->assertContains( 300, $result );
		$this->assertContains( 400, $result );
		$this->assertNotContains( 'media-skip-me', $result );
	}

	/**
	 * Test filterUncachedIds skips already-cached IDs.
	 */
	public function test_filter_uncached_ids_skips_cached() {
		wp_cache_set( 10, (object) [ 'ID' => 10 ], 'posts' );

		$result = $this->primer->filterUncachedIds( [ 10, 20, 30 ] );

		$this->assertNotContains( 10, $result );
		$this->assertContains( 20, $result );
		$this->assertContains( 30, $result );
	}

	/**
	 * Test filterUncachedIds deduplicates IDs.
	 */
	public function test_filter_uncached_ids_deduplicates() {
		$result = $this->primer->filterUncachedIds( [ 10, 10, 20, 20, 20 ] );

		$this->assertCount( 2, $result );
		$this->assertContains( 10, $result );
		$this->assertContains( 20, $result );
	}

	/**
	 * Test filterUncachedIds tracks primed IDs within the same instance.
	 */
	public function test_filter_uncached_ids_tracks_primed_ids() {
		$result1 = $this->primer->filterUncachedIds( [ 10, 20 ] );
		$this->assertContains( 10, $result1 );

		// Second call should skip ID 10 (already primed in this instance).
		$result2 = $this->primer->filterUncachedIds( [ 10, 30 ] );
		$this->assertNotContains( 10, $result2 );
		$this->assertContains( 30, $result2 );
	}

	/**
	 * Test warmPostCaches populates the object cache.
	 */
	public function test_warm_post_caches_populates_object_cache() {
		$attachment = self::factory()->post->create_and_get(
			[
				'post_type'   => 'attachment',
				'post_status' => 'inherit',
			]
		);

		wp_cache_delete( $attachment->ID, 'posts' );

		$this->primer->warmPostCaches( [ $attachment->ID ] );

		$cached = wp_cache_get( $attachment->ID, 'posts' );
		$this->assertNotFalse( $cached );
		$this->assertEquals( $attachment->ID, $cached->ID );
	}

	/**
	 * Test warmPostCaches also primes postmeta cache.
	 */
	public function test_warm_post_caches_primes_meta_cache() {
		$attachment = self::factory()->post->create_and_get(
			[
				'post_type'   => 'attachment',
				'post_status' => 'inherit',
			]
		);
		update_post_meta( $attachment->ID, '_wp_attachment_metadata', [ 'width' => 800 ] );

		wp_cache_delete( $attachment->ID, 'posts' );
		wp_cache_delete( $attachment->ID, 'post_meta' );

		$this->primer->warmPostCaches( [ $attachment->ID ] );

		$meta = get_post_meta( $attachment->ID, '_wp_attachment_metadata', true );
		$this->assertEquals( [ 'width' => 800 ], $meta );
	}

	/**
	 * Test warmPostCaches handles non-existent IDs gracefully.
	 */
	public function test_warm_post_caches_handles_nonexistent_ids() {
		$this->primer->warmPostCaches( [ 999999 ] );

		$this->assertFalse( wp_cache_get( 999999, 'posts' ) );
	}

	/**
	 * Test prime method caches attachment referenced by thumbnail.
	 */
	public function test_prime_caches_thumbnail_attachment() {
		$product    = self::factory()->post->create_and_get();
		$attachment = self::factory()->post->create_and_get(
			[
				'post_type'   => 'attachment',
				'post_status' => 'inherit',
			]
		);

		update_post_meta( $product->ID, '_thumbnail_id', (string) $attachment->ID );
		wp_cache_delete( $attachment->ID, 'posts' );

		$this->primer->prime( [ $product ] );

		$this->assertNotFalse( wp_cache_get( $attachment->ID, 'posts' ) );
	}

	/**
	 * Test prime is safe to call with empty array.
	 */
	public function test_prime_handles_empty_posts() {
		$this->primer->prime( [] );

		// No error = pass.
		$this->assertTrue( true );
	}
}
