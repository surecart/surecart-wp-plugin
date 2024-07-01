<?php

namespace SureCart\BlockLibrary;

/**
 * Provide the migration service for the product variant block.
 */
class ProductVariantsMigrationService {
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
	 * Render the product variant block.
	 *
	 * @return void
	 */
	public function renderProductVariants() {
		$this->block_html  = '<!-- wp:surecart/product-variant-pills -->';
		$this->block_html .= '<!-- wp:surecart/product-variant-pills-wrapper -->';
		$this->block_html .= '<!-- wp:surecart/product-variant-pill /-->';
		$this->block_html .= '<!-- /wp:surecart/product-variant-pills-wrapper -->';
		$this->block_html .= '<!-- /wp:surecart/product-variant-pills -->';
	}

	/**
	 * Render the blocks.
	 *
	 * @return string
	 */
	public function doBlocks() {
		return do_blocks( $this->block_html );
	}

	/**
	 * Render the new variants block.
	 *
	 * @return string
	 */
	public function render() {
		$this->renderProductVariants();
		return $this->doBlocks();
	}
}
