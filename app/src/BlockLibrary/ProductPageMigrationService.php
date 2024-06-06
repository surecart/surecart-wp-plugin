<?php

namespace SureCart\BlockLibrary;

/**
 * Provide the migration service for product page.
 */
class ProductPageMigrationService {
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
	 * Inner Blocks.
	 *
	 * @var array
	 */
	public array $inner_blocks = array();

	/**
	 * Constructor.
	 *
	 * @param $attributes array
	 * @param $block object
	 */
	public function __construct( $attributes = array(), $block = null ) {
		$this->attributes   = $attributes;
		$this->block        = $block;
		$this->inner_blocks = $block->parsed_block['innerBlocks'] ?? array();
	}

	/**
	 * Get a given child block attributes.
	 *
	 * @param $block_name string  The name of the child block.
	 *
	 * @return array $attributes  The attributes of the child block.
	 */
	public function getChildBlockAttributes( $block_name ) {
		if ( empty( $this->inner_blocks ) || empty( $this->inner_blocks[0] ) ) {
			return array();
		}

		foreach ( $this->inner_blocks[0]['innerBlocks'] as $block ) {
			if ( $block['blockName'] === $block_name ) {
				return $block['attrs'];
			}
		}

		return array();
	}

	/**
	 * Render the product title.
	 *
	 * @return void
	 */
	public function renderProductTitle() {
		$attributes        = wp_json_encode( $this->getChildBlockAttributes( 'surecart/product-title' ) );
		$this->block_html .= '<!-- wp:surecart/product-title-v2 ' . $attributes . ' /-->';
	}

	/**
	 * Render the product page.
	 *
	 * @return void
	 */
	public function renderProductPage() {
		$this->block_html .= '<!-- wp:surecart/product-page -->';
		$this->renderProductTitle();
		$this->block_html .= '<!-- /wp:surecart/product-page -->';
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
	 * Render the new product page.
	 *
	 * @return string
	 */
	public function render() {
		$this->renderProductPage();
		return $this->doBlocks();
	}
}
