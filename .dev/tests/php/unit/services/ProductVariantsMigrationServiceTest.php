<?php

namespace SureCart\Tests\Services;

use SureCart\BlockLibrary\ProductVariantsMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Test ProductSelectedPriceMigrationService
 */
class ProductVariantsMigrationServiceTest extends SureCartUnitTestCase {
	private $service = null;
	private $test_attributes = null;
	private $block  = null;

	/**
	 * Setup
	 */
	public function setUp():void {
		// set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers'=>[
				\SureCart\BlockLibrary\BlockServiceProvider::class
			]
		],false);

		$this->block = (object) [
			'parsed_block' => array(
				'blockName' =>'surecart/product-variant-choices',
				'attrs' => array('key1' => 'value1')
			)
		];
		$this->test_attributes = [
			'textColor' => 'accent-3',
			'backgroundColor' => 'accent-3',
		];

		$this->service = new ProductVariantsMigrationService(
			$this->test_attributes,
			$this->block
		);

		parent::setUp();
	}

	/**
	 * @group block
	 */
	public function test_constructor_sets_attributes(){
		$this->assertSame($this->test_attributes, $this->service->attributes);
	}

	/**
	 * @group block
	 */
	public function test_render_variant_pill(){
		$this->service->renderVariantPill();
		$this->assertStringContainsString('<!-- wp:surecart/product-variant-pill', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_product_variants(){
		$this->service->renderProductVariants();
		$this->assertStringContainsString('<!-- wp:surecart/product-variant-pills', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-variant-pills-wrapper', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_product_variants_all_attributes(){
		//  {"style":{"typography":{"fontSize":"16px"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|20","right":"var:preset|spacing|20"},"margin":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|80","right":"var:preset|spacing|80"}},"elements":{"link":{"color":{"text":"var:preset|color|vivid-red"}}},"border":{"width":"2px","color":"#0693e3","radius":"8px"}},"backgroundColor":"pale-pink","textColor":"vivid-red"}
		$this->test_attributes = [
			'style' => [
				'typography' => [
					'fontSize' => '16px'
				],
				'spacing' => [
					'padding' => [
						'top' => 'var:preset|spacing|20',
						'bottom' => 'var:preset|spacing|20',
						'left' => 'var:preset|spacing|20',
						'right' => 'var:preset|spacing|20'
					],
					'margin' => [
						'top' => 'var:preset|spacing|80',
						'bottom' => 'var:preset|spacing|80',
						'left' => 'var:preset|spacing|80',
						'right' => 'var:preset|spacing|80'
					]
				],
				'elements' => [
					'link' => [
						'color' => [
							'text' => 'var:preset|color|vivid-red'
						]
					]
				],
				'border' => [
					'width' => '2px',
					'color' => '#0693e3',
					'radius' => '8px'
				]
			],
			'backgroundColor' => 'pale-pink',
			'textColor' => 'vivid-red'
		];

		$this->service = new ProductVariantsMigrationService(
			$this->test_attributes,
			$this->block
		);
		$this->service->renderProductVariants();

		$this->assertStringContainsString('<!-- wp:surecart/product-variant-pills {"style":{"spacing":{"margin":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|80","right":"var:preset|spacing|80"}}}} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-variant-pills-wrapper', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-variant-pill {"style":{"typography":{"fontSize":"16px"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|20","right":"var:preset|spacing|20"}},"elements":{"link":{"color":{"text":"var:preset|color|vivid-red"}}},"border":{"width":"2px","color":"#0693e3","radius":"8px"}},"backgroundColor":"pale-pink","textColor":"vivid-red","highlight_text":"#ffffff","highlight_background":"#000000","highlight_border":"#000000"}  /-->', $this->service->block_html);
	}
}
