<?php

namespace SureCart\BlockLibrary;

/**
 * Provide the migration service for the product price block.
 */
class ProductSelectedPriceMigrationService {
	/**
	 * Attributes
	 *
	 * @var array
	 */
	protected $attributes = array();

	/**
	 * Block.
	 *
	 * @var object
	 */
	public ?object $block = null;

	/**
	 * Block HTML.
	 *
	 * @var string
	 */
	public string $block_html = '';

	/**
	 * Constructor
	 *
	 * @param array  $attributes Attributes.
	 * @param object $block Block.
	 */
	public function __construct( $attributes = array(), $block = null ) {
		$this->attributes = $attributes;
		$this->block      = $block;
	}

	/**
	 * Get content alignment
	 *
	 * @return string
	 */
	public function getContentAlignment() {
		return $this->attributes['alignment'] ?? 'left';
	}

	/**
	 * Render the price scratch amount, selected price and sales badge.
	 *
	 * @return void
	 */
	public function renderScratchAmountAndSalesBadge() {
		$sale_text = $this->attributes['sale_text'] ?? 'Discounted';

		$this->block_html  = '<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"' . $this->getContentAlignment() . '"}} -->';
		$this->block_html  = '<div class="wp-block-group" >';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-scratch-amount {"style":{"typography":{"textDecoration":"line-through","fontSize":"24px"},"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-amount {"style":{"typography":{"fontSize":"24px"}}} /-->';
		$this->block_html .= '<!-- wp:surecart/product-sale-badge {"text":"' . $sale_text . '","style":{"border":{"radius":"100px"},"typography":{"fontSize":"12px"},"layout":{"selfStretch":"fit","flexSize":null}}} /-->';
		$this->block_html  = '</div>';
		$this->block_html  = '<!-- /wp:group -->';
	}

	/**
	 * Render selected price trial and fees.
	 *
	 * @return void
	 */
	public function renderSelectedPriceTrialAndFees() {
		$this->block_html  = '<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"' . $this->getContentAlignment() . '"}} -->';
		$this->block_html  = '<div class="wp-block-group" >';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-trial {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-fees {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->';
		$this->block_html  = '</div>';
		$this->block_html  = '<!-- /wp:group -->';
	}

	/**
	 * Render the price.
	 *
	 * @return void
	 */
	public function renderPrice() {
		$this->block_html = '<!-- wp:group {"style":{"spacing":{"blockGap":"0"}},"layout":{"type":"constrained"}} -->';
		$this->block_html = '<div class="wp-block-group" >';
		$this->renderScratchAmountAndSalesBadge();
		$this->renderSelectedPriceTrialAndFees();
		$this->block_html = '</div>';
		$this->block_html = '<!-- /wp:group -->';
	}

	/**
	 * Render blocks.
	 *
	 * @return string
	 */
	public function doBlocks() {
		return do_blocks( $this->block_html );
	}

	/**
	 * Render the new price.
	 *
	 * @return string
	 */
	public function render() {
		$this->renderPrice();
		return $this->doBlocks();
	}
}
