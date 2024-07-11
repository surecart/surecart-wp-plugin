<?php

namespace SureCart\Tests\Services;

use SureCart\BlockLibrary\ProductSelectedPriceMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Test ProductSelectedPriceMigrationService
 */
class ProductSelectedPriceMigrationServiceTest extends SureCartUnitTestCase {
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
				'blockName' =>'surecart/product-selected-price',
				'attrs' => array('key1' => 'value1')
			)
		];
		$this->test_attributes = [
			'alignment' => 'center',
			'sale_text' => 'Sale'
		];

		$this->service = new ProductSelectedPriceMigrationService(
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
	public function test_get_content_alignment(){
		$this->assertSame('center', $this->service->getContentAlignment());
	}

	/**
	 * @group block
	 */
	public function test_render_sales_badge_with_default_text(){
		$this->service->renderSalesBadge();

		$this->assertStringContainsString('<!-- wp:surecart/product-sale-badge {"text":"Sale","style":{"border":{"radius":"15px"},"typography":{"fontSize":"12px"},"layout":{"selfStretch":"fit","flexSize":null}}}', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_sales_badge_with_custom_text(){
		$this->test_attributes['sale_text'] = 'Test Sale';
		$this->service = new ProductSelectedPriceMigrationService(
			$this->test_attributes,
			$this->block
		);
		$this->service->renderSalesBadge();

		$this->assertStringContainsString('<!-- wp:surecart/product-sale-badge {"text":"Test Sale","style":{"border":{"radius":"15px"},"typography":{"fontSize":"12px"},"layout":{"selfStretch":"fit","flexSize":null}}}', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_scratch_amount_selected_price_and_sales_badge(){
		$this->service->renderScratchAmountAndSalesBadge();

		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-scratch-amount', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-amount', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-sale-badge', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_selected_price_trial_and_fees(){
		$this->service->renderSelectedPriceTrialAndFees();

		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-trial', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-fees', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price(){
		$this->service->renderPrice();

		$this->assertStringContainsString('<!-- wp:group', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-amount', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-trial', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-sale-badge', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price_with_all_attributes(){
		$this->test_attributes = array(
			'alignment' => 'center',
			'sale_text' => 'Test Sale',
			'backgroundColor' => 'red',
			'textColor' => 'black',
		);
		$this->service = new ProductSelectedPriceMigrationService(
			$this->test_attributes,
			$this->block
		);
		$this->service->renderPrice();

		$this->assertStringContainsString('<!-- wp:group {"style":{"spacing":[]},"layout":{"type":"constrained"},"backgroundColor":"red"} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-scratch-amount {"alignment":"center","sale_text":"Test Sale","backgroundColor":"red","textColor":"black","style":{"typography":{"textDecoration":"line-through","fontSize":"24px"},"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-amount {"alignment":"center","sale_text":"Test Sale","backgroundColor":"red","textColor":"black","style":{"typography":{"textDecoration":"line-through","fontSize":"24px"},"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}}', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-sale-badge {"text":"Test Sale","style":{"border":{"radius":"15px"},"typography":{"fontSize":"12px"},"layout":{"selfStretch":"fit","flexSize":null}}} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-trial {"alignment":"center","sale_text":"Test Sale","backgroundColor":"red","textColor":"black","style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-selected-price-fees {"alignment":"center","sale_text":"Test Sale","backgroundColor":"red","textColor":"black","style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->', $this->service->block_html);
	}
}
