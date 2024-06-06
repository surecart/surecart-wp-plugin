<?php

namespace SureCart\Tests\Services;

use SureCart\BlockLibrary\ProductListMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

class ProductListMigrationServiceTest extends SureCartUnitTestCase {
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\BlockLibrary\BlockServiceProvider::class,
			],
		], false);

		$attributes = [
			'limit' => 10,
			'columns' => 3,
			'search_enabled' => true,
			'pagination_enabled' => true,
			'sort_enabled' => true,
			'collection_enabled' => true,
		];
        
		$block = (object) [
            'parsed_block' => [
                'innerBlocks' => [
                    [
						'blockName' => 'surecart/product-template',
                        'innerBlocks' => [
							['blockName' => 'surecart/product-item-image', 'attrs' => ['key1' => 'value1']],
                            ['blockName' => 'surecart/product-item-title', 'attrs' => ['key2' => 'value2']],
							['blockName' => 'surecart/product-item-price', 'attrs' => ['key3' => 'value3']]
                        ],
                    ],
                ],
            ],
        ];

		$this->service = new ProductListMigrationService(
			$attributes,
			$block
		);

		parent::setUp();
	}

	/**
	 * @group block
	 */
	public function test_constructor_sets_attributes()
    {
        $attributes = [
			'limit' => 10,
			'columns' => 3,
			'search_enabled' => true,
			'pagination_enabled' => true,
			'sort_enabled' => true,
			'collection_enabled' => true,
		];
        
        $this->assertSame($attributes, $this->service->attributes);
    }

	/**
	 * @group block
	 */
	public function test_get_child_blocks_attributes()
    {
        $block = (object) [
            'parsed_block' => [
                'innerBlocks' => [
                    [
						'blockName' => 'surecart/product-template',
                        'innerBlocks' => [
							['blockName' => 'surecart/product-item-image', 'attrs' => ['key1' => 'value1']],
                            ['blockName' => 'surecart/product-item-title', 'attrs' => ['key2' => 'value2']],
							['blockName' => 'surecart/product-item-price', 'attrs' => ['key3' => 'value3']]
                        ],
                    ],
                ],
            ],
        ];

        $service = new ProductListMigrationService([], $block);

        $result = $this->service->getChildBlocksAttributes('surecart/product-item-title');
        $this->assertSame(['key2' => 'value2', 'level'=>0], $result);
    }

	/**
	 * @group block
	 */
	public function test_get_child_blocks_attributes_returns_empty_array_if_no_inner_blocks()
	{
		$block = (object) ['parsed_block' => ['innerBlocks' => []]];

		$service = new ProductListMigrationService([], $block);

		$result = $this->service->getChildBlocksAttributes('test/block');
		$this->assertSame([], $result);
	}

	/**
	 * @group block
	 */
	public function test_render_title()
	{
		$this->service->renderTitle();
		$this->assertStringContainsString('<!-- wp:surecart/product-title-v2 {"key2":"value2","level":0} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_image()
	{
		$this->service->renderImage();
		$this->assertStringContainsString('<!-- wp:surecart/product-image {"key1":"value1"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price()
	{
		$this->service->renderPrice();
		$this->assertStringContainsString('<!-- wp:surecart/product-price-v2 {"key3":"value3"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_product_template()
	{
		$this->service->renderProductTemplate();
		var_dump($this->service->inner_blocks[0]['innerBlocks']);
		$this->assertStringContainsString('<!-- wp:surecart/product-template {"layout":{"type":"grid","columnCount":3}} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-image {"key1":"value1"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-title-v2 {"key2":"value2","level":0} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-price-v2 {"key3":"value3"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- /wp:surecart/product-template -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_pagination()
	{
		$this->service->renderPagination();
		$this->assertStringContainsString('<!-- wp:surecart/product-pagination --><!-- wp:surecart/product-pagination-previous /--><!-- wp:surecart/product-pagination-numbers /--><!-- wp:surecart/product-pagination-next /--><!-- /wp:surecart/product-pagination -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_pagination_does_not_render_if_pagination_disabled()
	{
		$this->service->attributes['pagination_enabled'] = false;
		$this->service->renderPagination();
		$this->assertStringNotContainsString('<!-- wp:surecart/product-pagination --><!-- wp:surecart/product-pagination-previous /--><!-- wp:surecart/product-pagination-numbers /--><!-- wp:surecart/product-pagination-next /--><!-- /wp:surecart/product-pagination -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_search()
	{
		$this->service->renderSearch();
		$this->assertStringContainsString('<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group"><!-- wp:surecart/product-list-search /--></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_search_does_not_render_if_search_disabled()
	{
		$this->service->attributes['search_enabled'] = false;
		$this->service->renderSearch();
		$this->assertStringNotContainsString('<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group"><!-- wp:surecart/product-list-search /--></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_sort_and_filter()
	{
		$this->service->renderSortAndFilter();
		$this->assertStringContainsString('<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group"><!-- wp:surecart/product-list-sort /--><!-- wp:surecart/product-list-filter /--></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_sort_and_filter_does_not_render_if_sort_disabled()
	{
		$this->service->attributes['sort_enabled'] = false;
		$this->service->renderSortAndFilter();
		$this->assertStringContainsString('<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group"><!-- wp:surecart/product-list-filter /--></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_sort_and_filter_does_not_render_if_filter_disabled()
	{
		$this->service->attributes['collection_enabled'] = false;
		$this->service->renderSortAndFilter();
		$this->assertStringContainsString('<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group"><!-- wp:surecart/product-list-sort /--></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_sort_and_filter_does_not_render_if_filter_and_sort_disabled()
	{
		$this->service->attributes['collection_enabled'] = false;
		$this->service->attributes['sort_enabled'] = false;
		$this->service->renderSortAndFilter();
		$this->assertStringNotContainsString('<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group"><!-- wp:surecart/product-list-sort /--><!-- wp:surecart/product-list-filter /--></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_filter_tags()
	{
		$this->service->renderFilterTags();
		$this->assertStringContainsString('<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group" style="margin-bottom:10px"><!-- wp:surecart/product-list-filter-tags --><!-- wp:surecart/product-list-filter-tag /--></div><!-- /wp:group --></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_filter_tags_does_not_render_if_filter_disabled()
	{
		$this->service->attributes['collection_enabled'] = false;
		$this->service->renderFilterTags();
		$this->assertStringNotContainsString('<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group" style="margin-bottom:10px"><!-- wp:surecart/product-list-filter-tags --><!-- wp:surecart/product-list-filter-tag /--></div><!-- /wp:group --></div><!-- /wp:group -->', $this->service->block_html);
	}
}
