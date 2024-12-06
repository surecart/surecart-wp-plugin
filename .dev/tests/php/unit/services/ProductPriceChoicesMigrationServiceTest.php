<?php

use SureCart\BlockLibrary\ProductPriceChoicesMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

class ProductPriceChoicesMigrationServiceTest extends SureCartUnitTestCase{
	private $service = null;
	private $test_attributes = null;
	private $block = null;

	public function setUp():void {
		// set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers'=>[
				\SureCart\BlockLibrary\BlockServiceProvider::class
			]
		],false);

		$this->test_attributes = array(
			'label' => 'Test label',
			'columns' => 3,
			'show_price' => true
		);

		$this->block = (object) [
			'parsed_block' => array(
				'blockName' =>'surecart/product-price-choices',
				'attrs' => array('key1' => 'value1')
			)
		];

		$this->service = new ProductPriceChoicesMigrationService(
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
	public function test_render_price_name(){
		$this->service->renderPriceName();
		$this->assertStringContainsString('<!-- wp:surecart/price-name {"style":{"layout":{"selfStretch":"fixed","flexSize":"50%"},"typography":{"fontStyle":"normal","fontWeight":"600"}}} /-->', $this->service->block_html);
	}

	/**
	 * @group testraj
	 */
	public function test_render_price_amount_scratch_amount_trial_and_setup_fee(){
		$this->service->renderPriceAmountScratchAmountTrialAndSetupFee();
		$this->assertStringContainsString('<!-- wp:group {"style":{"spacing":{"blockGap":"0px"},"layout":{"selfStretch":"fixed","flexSize":"50%"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"right"}} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:group {"style":{"spacing":{"blockGap":"0.5rem"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left"}} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-amount', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-scratch-amount', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-interval', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-trial', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-setup-fee', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price_choices(){
		$this->service->renderPriceChoices();
		$this->assertStringContainsString('<!-- wp:surecart/product-price-chooser', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-price-choice-template', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-amount', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-trial', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/price-setup-fee', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price_choices_with_custom_label(){
		$this->test_attributes = array(
			'label' => 'Custom label',
			'columns' => 3,
			'show_price' => true
		);

		$this->service = new ProductPriceChoicesMigrationService(
			$this->test_attributes,
			$this->block
		);

		$this->service->renderPriceChoices();
		$this->assertStringContainsString('<!-- wp:surecart/product-price-chooser {"label":"Custom label"} -->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price_choices_with_hidden_price(){
		$this->test_attributes = array(
			'label' => 'Custom label',
			'columns' => 3,
			'show_price' => false
		);

		$this->service = new ProductPriceChoicesMigrationService(
			$this->test_attributes,
			$this->block
		);

		$this->service->renderPriceChoices();
		$this->assertStringNotContainsString('<!-- wp:surecart/price-amount', $this->service->block_html);
		$this->assertStringNotContainsString('<!-- wp:surecart/price-trial', $this->service->block_html);
		$this->assertStringNotContainsString('<!-- wp:surecart/price-setup-fee', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_price_choices_with_all_attributes(){
		$this->test_attributes = array(
			'label' => 'Custom label',
			'columns' => 3,
			'show_price' => true,
			'textColor' => 'black',
			'backgroundColor' => 'white',
			'elements' => array(
				'link' => array(
					'color' => array(
						'text' => 'red'
					)
				)
			)
		);

		$this->service = new ProductPriceChoicesMigrationService(
			$this->test_attributes,
			$this->block
		);

		$this->service->renderPriceChoices();
		$this->assertStringContainsString('<!-- wp:surecart/product-price-chooser {"label":"Custom label"} -->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/product-price-choice-template {"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap","orientation":"horizontal"},"textColor":"black","backgroundColor":"white","style":[]} -->', $this->service->block_html);
	}
}
