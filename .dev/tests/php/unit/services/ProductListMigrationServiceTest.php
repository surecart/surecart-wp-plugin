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
		$this->assertStringContainsString('<!-- wp:surecart/product-title {"key2":"value2","level":0,"style":{"spacing":{}}} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_image()
	{
		$this->service->renderImage();
		$this->assertStringContainsString('<!-- wp:group {"style":{"color":{"background":"#0000000d"},"border":{"radius":"10px"},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px"}}},"layout":{"type":"constrained"}} --><div class="wp-block-group has-background" style="border-radius:10px;background-color:#0000000d;margin-top:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><!-- wp:cover {"useFeaturedImage":true,"minHeight":0,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top right","isDark":false,"style":{"dimensions":{"aspectRatio":"3\/4"},"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"margin":{"bottom":"15px"}},"border":{"radius":"10px"}}} --><div class="wp-block-cover is-light has-custom-content-position is-position-top-right" style="border-radius:10px;"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:surecart/product-sale-badge {"style":{"typography":{"fontSize":"12px"},"border":{"radius":"100px"}}} /--></div></div><!-- /wp:cover --></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price()
	{
		$this->service->renderPrice();
		$this->assertStringContainsString('<!-- wp:surecart/product-list-price {"key3":"value3"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_product_template()
	{
		$this->service->renderProductTemplate();
		$this->assertStringContainsString('<!-- wp:surecart/product-template {"style":{"spacing":{"blockGap":"30px"}},"layout":{"type":"grid","columnCount":3},"limit":10,"columns":3,"search_enabled":true,"pagination_enabled":true,"sort_enabled":true,"collection_enabled":true} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:cover {"useFeaturedImage":true,"minHeight":0,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top right","isDark":false,"style":{"dimensions":{"aspectRatio":"3\/4"},"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"margin":{"bottom":"15px"}},"border":{"radius":"10px"}}} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-title {"key2":"value2","level":0,"style":{"spacing":{}}} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-list-price {"key3":"value3"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- /wp:surecart/product-template -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_pagination()
	{
		$this->service->renderPagination();
		$this->assertStringContainsString('<!-- wp:surecart/product-pagination  --><!-- wp:surecart/product-pagination-previous /--><!-- wp:surecart/product-pagination-numbers /--><!-- wp:surecart/product-pagination-next /--><!-- /wp:surecart/product-pagination -->', $this->service->block_html);
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
		$this->assertStringContainsString('<!-- wp:surecart/product-list-search {"style":{"layout":{"selfStretch":"fixed","flexSize":"250px"}}} /-->', $this->service->block_html);
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
		$this->assertStringContainsString('<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group" style="margin-bottom:10px"><!-- wp:surecart/product-list-filter-tags --><!-- wp:surecart/product-list-filter-tags-template --><!-- wp:surecart/product-list-filter-tag /--></div><!-- /wp:group --></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_filter_tags_does_not_render_if_filter_disabled()
	{
		$this->service->attributes['collection_enabled'] = false;
		$this->service->renderFilterTags();
		$this->assertStringNotContainsString('<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group" style="margin-bottom:10px"><!-- wp:surecart/product-list-filter-tags --><!-- wp:surecart/product-list-filter-tags-template --><!-- wp:surecart/product-list-filter-tag /--></div><!-- /wp:group --></div><!-- /wp:group -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_product_list_with_all_attrs_and_styles_applied()
	{
		$attributes = [
			'limit' => 5,
			'type' => 'custom',
			'ids' => [
				'b0bb8d48-7bba-4d6f-ac58-7b801d1471fb',
				'6730d1ca-871c-4f55-90ad-923fd81bff6a',
				'585504de-74ac-48b9-9c62-563b86cd8ed3',
				'a029510f-7aed-451f-8a49-357d11b2b450'
			],
			'style' => [
				'spacing' => [
					'blockGap' => 'var:preset|spacing|20'
				]
			]
		];

		$block = (object) [
            'parsed_block' => [
				'blockName' => 'surecart/product-item-list',
				'attrs' => array(
					'limit' => 5,
					'type' => 'custom',
					'ids' => array(
						'b0bb8d48-7bba-4d6f-ac58-7b801d1471fb',
						'6730d1ca-871c-4f55-90ad-923fd81bff6a',
						'585504de-74ac-48b9-9c62-563b86cd8ed3',
						'a029510f-7aed-451f-8a49-357d11b2b450'
					),
					'style' => array(
						'spacing' => array(
							'blockGap' => 'var:preset|spacing|20'
						)
					)
				),
				'innerBlocks' => array(
					array(
						'blockName' => 'surecart/product-item',
						'attrs' => array(
							'borderColor' => 'accent-4',
							'backgroundColor' => 'accent-3',
							'style' => array(
								'spacing' => array(
									'padding' => array(
										'top' => 'var:preset|spacing|10',
										'bottom' => 'var:preset|spacing|10',
										'left' => 'var:preset|spacing|10',
										'right' => 'var:preset|spacing|10'
									),
									'margin' => array(
										'top' => 'var:preset|spacing|10',
										'bottom' => 'var:preset|spacing|10',
										'left' => 'var:preset|spacing|10',
										'right' => 'var:preset|spacing|10'
									)
								),
								'border' => array(
									'radius' => '20px',
									'width' => '12px'
								)
							)
						),
						'innerBlocks' => array(
							array(
								'blockName' => 'surecart/product-item-image',
								'attrs' => array(
									'sizing' => 'cover',
									'ratio' => '1/1.33',
									'borderColor' => 'base-2',
									'style' => array(
										'border' => array(
											'radius' => '6px',
											'width' => '6px'
										),
										'spacing' => array(
											'padding' => array(
												'top' => 'var:preset|spacing|10',
												'bottom' => 'var:preset|spacing|10',
												'left' => 'var:preset|spacing|10',
												'right' => 'var:preset|spacing|10'
											),
											'margin' => array(
												'top' => 'var:preset|spacing|10',
												'bottom' => 'var:preset|spacing|10',
												'left' => 'var:preset|spacing|10',
												'right' => 'var:preset|spacing|10'
											)
										)
									)
								),
								'innerBlocks' => array(),
								'innerHTML' => '',
								'innerContent' => array()
							),
							array(
								'blockName' => 'surecart/product-item-price',
								'attrs' => array(
									'style' => array(
										'spacing' => array(
											'padding' => array('top' => '6px'),
											'margin' => array(
												'top' => 'var:preset|spacing|10',
												'bottom' => 'var:preset|spacing|10'
											)
										),
										'color' => array(
											'text' => '#ffea00'
										),
										'typography' => array(
											'fontSize' => '20px'
										)
									)
								),
								'innerBlocks' => array(),
								'innerHTML' => '',
								'innerContent' => array()
							),
							array(
								'blockName' => 'surecart/product-item-title',
								'attrs' => array(
									'title' => 'Product Title',
									'textColor' => 'base',
									'fontSize' => 'x-small',
									'style' => array(
										'typography' => array(
											'fontWeight' => '500'
										),
										'spacing' => array(
											'padding' => array('top' => '10px'),
											'margin' => array(
												'top' => 'var:preset|spacing|10',
												'bottom' => 'var:preset|spacing|10'
											)
										)
									)
								),
								'innerBlocks' => array(),
								'innerHTML' => '',
								'innerContent' => array()
							)
						),
						'innerHTML' => '',
						'innerContent' => array()
					)
				),
				'innerHTML' => '',
				'innerContent' => array()
			]
		];

		$this->service = new ProductListMigrationService(
			$attributes,
			$block
		);

		$this->service->renderProductTemplate();
		$this->assertStringContainsString('<!-- wp:surecart/product-template {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"grid","columnCount":3},"limit":5,"type":"custom","ids":["b0bb8d48-7bba-4d6f-ac58-7b801d1471fb","6730d1ca-871c-4f55-90ad-923fd81bff6a","585504de-74ac-48b9-9c62-563b86cd8ed3","a029510f-7aed-451f-8a49-357d11b2b450"]} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:cover {"useFeaturedImage":true,"minHeight":0,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top right","isDark":false,"style":{"dimensions":{"aspectRatio":"1\/1.33"},"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"margin":{"bottom":"15px"}},"border":{"radius":"10px"}}} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-list-price {"style":{"spacing":{"padding":{"top":"6px"},"margin":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10"}},"color":{"text":"#ffea00"},"typography":{"fontSize":"20px"}}} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-title {"title":"Product Title","textColor":"base","fontSize":"x-small","style":{"typography":{"fontWeight":"500"},"spacing":{"padding":{"top":"10px"},"margin":{"top":"0px","bottom":"var:preset|spacing|10"}}},"level":0} /-->', $this->service->block_html);
		$this->assertStringContainsString('</div><!-- /wp:group --><!-- /wp:surecart/product-template -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_product_list_with_no_image_price_title_block()
	{
		$attributes = [
			'limit' => 5,
			'type' => 'custom',
			'style' => [
				'spacing' => [
					'blockGap' => 'var:preset|spacing|20'
				]
			]
		];

		$block = (object) [
            'parsed_block' => [
				'blockName' => 'surecart/product-item-list',
				'attrs' => array(
					'limit' => 5,
					'type' => 'custom',
					'style' => array(
						'spacing' => array(
							'blockGap' => 'var:preset|spacing|20'
						)
					)
				),
				'innerBlocks' => array(
					array(
						'blockName' => 'surecart/product-item',
						'attrs' => array(
							'borderColor' => 'accent-4',
							'backgroundColor' => 'accent-3',
							'style' => array(
								'spacing' => array(
									'padding' => array(
										'top' => 'var:preset|spacing|10',
										'bottom' => 'var:preset|spacing|10',
										'left' => 'var:preset|spacing|10',
										'right' => 'var:preset|spacing|10'
									),
									'margin' => array(
										'top' => 'var:preset|spacing|10',
										'bottom' => 'var:preset|spacing|10',
										'left' => 'var:preset|spacing|10',
										'right' => 'var:preset|spacing|10'
									)
								),
								'border' => array(
									'radius' => '20px',
									'width' => '12px'
								)
							)
						),
						'innerBlocks' => array(),
						'innerHTML' => '',
						'innerContent' => array()
					)
				),
				'innerHTML' => '',
				'innerContent' => array()
			]
		];

		$this->service = new ProductListMigrationService(
			$attributes,
			$block
		);

		$this->service->renderProductTemplate();
		$this->assertStringNotContainsString('<!-- wp:cover {"useFeaturedImage":true,"dimRatio":0,"isUserOverlayColor":true,"focalPoint":{"x":0.5,"y":0.5},"contentPosition":"top right","isDark":false', $this->service->block_html);
		$this->assertStringNotContainsString('<!-- wp:surecart/product-list-price', $this->service->block_html);
		$this->assertStringNotContainsString('<!-- wp:surecart/product-title', $this->service->block_html);
	}
}
