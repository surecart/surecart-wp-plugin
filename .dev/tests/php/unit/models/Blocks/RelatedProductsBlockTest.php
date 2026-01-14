<?php

namespace SureCart\Tests\Models\Blocks;

use SureCart\Models\Blocks\RelatedProductsBlock;
use SureCart\Tests\SureCartUnitTestCase;

class RelatedProductsBlockTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\WordPress\PluginServiceProvider::class,
					\SureCart\BlockLibrary\BlockServiceProvider::class,
				],
			],
			false
		);
	}

	/**
	 * Test that offsetFoundPosts returns correct value with offset.
	 */
	public function test_offset_found_posts_subtracts_offset() {
		$block = $this->createRelatedProductsBlock( [ 'offset' => 5 ] );

		$result = $block->offsetFoundPosts( 100 );

		$this->assertEquals( 95, $result );
	}

	/**
	 * Test that offsetFoundPosts returns zero when offset exceeds found posts.
	 */
	public function test_offset_found_posts_returns_zero_when_offset_exceeds_found() {
		$block = $this->createRelatedProductsBlock( [ 'offset' => 150 ] );

		$result = $block->offsetFoundPosts( 100 );

		$this->assertEquals( 0, $result );
	}

	/**
	 * Test that offsetFoundPosts returns original count with zero offset.
	 */
	public function test_offset_found_posts_with_zero_offset() {
		$block = $this->createRelatedProductsBlock( [ 'offset' => 0 ] );

		$result = $block->offsetFoundPosts( 50 );

		$this->assertEquals( 50, $result );
	}

	/**
	 * Test that parse_query returns correct structure.
	 */
	public function test_parse_query_returns_correct_structure() {
		$block = $this->createRelatedProductsBlock();

		$query = $block->parse_query();

		$this->assertArrayHasKey( 'fields', $query );
		$this->assertArrayHasKey( 'join', $query );
		$this->assertArrayHasKey( 'where', $query );
		$this->assertArrayHasKey( 'limits', $query );
	}

	/**
	 * Test that parse_query includes correct post type in where clause.
	 */
	public function test_parse_query_includes_product_post_type() {
		$block = $this->createRelatedProductsBlock();

		$query = $block->parse_query();

		$this->assertStringContainsString( "post_type = 'sc_product'", $query['where'] );
		$this->assertStringContainsString( "post_status = 'publish'", $query['where'] );
	}

	/**
	 * Test that parse_query respects perPage and pages attributes.
	 */
	public function test_parse_query_calculates_limit_from_per_page_and_pages() {
		$block = $this->createRelatedProductsBlock(
			[
				'perPage' => 10,
				'pages'   => 2,
				'offset'  => 0,
			]
		);

		$query = $block->parse_query();

		// Limit should be (perPage * pages) + offset = (10 * 2) + 0 = 20
		$this->assertStringContainsString( 'LIMIT 20', $query['limits'] );
	}

	/**
	 * Test that parse_query includes offset in limit calculation.
	 */
	public function test_parse_query_includes_offset_in_limit() {
		$block = $this->createRelatedProductsBlock(
			[
				'perPage' => 5,
				'pages'   => 2,
				'offset'  => 3,
			]
		);

		$query = $block->parse_query();

		// Limit should be (perPage * pages) + offset = (5 * 2) + 3 = 13
		$this->assertStringContainsString( 'LIMIT 13', $query['limits'] );
	}

	/**
	 * Helper to create a RelatedProductsBlock instance with mocked WP_Block.
	 *
	 * @param array $query_attrs Query attributes.
	 *
	 * @return RelatedProductsBlock
	 */
	private function createRelatedProductsBlock( array $query_attrs = [] ): RelatedProductsBlock {
		$default_attrs = [
			'perPage' => 15,
			'pages'   => 3,
			'offset'  => 0,
		];

		$attrs = array_merge( $default_attrs, $query_attrs );

		$mock_block = \Mockery::mock( \WP_Block::class );
		$mock_block->parsed_block = [
			'attrs' => [
				'query' => $attrs,
			],
		];
		$mock_block->context = [
			'query' => $attrs,
		];

		return new RelatedProductsBlock( $mock_block );
	}
}
