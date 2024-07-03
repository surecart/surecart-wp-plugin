<?php

namespace SureCart\Tests\Services;

use SureCart\BlockLibrary\ProductCollectionBadgesMigrationService;
use SureCart\Tests\SureCartUnitTestCase;


/**
 * Test ProductCollectionBadgesMigrationService
 */
class ProductCollectionBadgesMigrationServiceTest extends SureCartUnitTestCase {
	private $service = null;
	private $test_attributes = null;
	private $block = null;

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
				'blockName' =>'surecart/product-collection-badges',
				'attrs' => array('key1' => 'value1')
			)
		];
		$this->test_attributes = [
			'backgroundColor' => 'red',
			'count' =>2
		];

		$this->service = new ProductCollectionBadgesMigrationService(
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
	public function test_render_render_product_collection_badges(){
		$this->service->renderProductCollectionBadges();
		$this->assertStringContainsString('<!-- wp:surecart/product-collection-tags', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-collection-tag ', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_product_collection_badges_with_all_attributes(){
		$this->test_attributes = array(
			'count' => 3,
			'style' => array(
				'typography' => array(
					'fontSize' => '15px',
					'fontStyle' => 'normal',
					'fontWeight' => '400',
					'textTransform' => 'lowercase'
				),
				'elements' => array(
					'link' => array(
						'color' => array(
							'text' => 'var:preset|color|ast-global-color-1'
						)
					)
				),
				'spacing' => array(
					'padding' => array(
						'left' => 'var:preset|spacing|40',
						'right' => 'var:preset|spacing|40',
						'top' => 'var:preset|spacing|30',
						'bottom' => 'var:preset|spacing|30'
					),
					'blockGap' => '3px'
				),
				'border' => array(
					'width' => '1px',
					'color' => '#cf2e2e',
					'radius' => '19px'
				)
			),
			'backgroundColor' => 'pale-cyan-blue',
			'textColor' => 'ast-global-color-1'
		);

		$this->service = new ProductCollectionBadgesMigrationService(
			$this->test_attributes,
			$this->block
		);
		$this->service->renderProductCollectionBadges();
		$this->assertStringContainsString('<!-- wp:surecart/product-collection-tags {"count":3,"style":{"spacing":{"blockGap":"3px"}}} -->', $this->service->block_html);
		$this->assertStringContainsString(
			'<!-- wp:surecart/product-collection-tag {"count":3,"style":{"typography":{"fontSize":"15px","fontStyle":"normal","fontWeight":"400","textTransform":"lowercase"},"elements":{"link":{"color":{"text":"var:preset|color|ast-global-color-1"}}},"spacing":{"padding":{"left":"var:preset|spacing|40","right":"var:preset|spacing|40","top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"},"blockGap":"3px"},"border":{"width":"1px","color":"#cf2e2e","radius":"19px"}},"backgroundColor":"pale-cyan-blue","textColor":"ast-global-color-1"} /-->',
			$this->service->block_html
		);
	}
}
