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
	 * Get a given block attributes.
	 *
	 * @param string $block_name The name of the block.
	 *
	 * @return array $attributes  The attributes of the child block.
	 */
	public function getBlockAttributes( $block_name ) {
		$has_inner_blocks = ! empty( $this->inner_blocks ) && ! empty( $this->inner_blocks[0] );
		if ( ! $has_inner_blocks && $this->block->parsed_block['blockName'] === $block_name ) {
			return $this->block->parsed_block['attrs'];
		}

		if ( ! $has_inner_blocks ) {
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
	 * Render the product media.
	 *
	 * @return void
	 */
	public function renderProductMedia() {
		$attributes        = wp_json_encode( $this->getBlockAttributes( 'surecart/product-media' ) );
		$this->block_html .= '<!-- wp:surecart/product-media-v2 ' . $attributes . ' /-->';
	}

	/**
	 * Render the product title.
	 *
	 * @return void
	 */
	public function renderProductTitle() {
		$attributes        = wp_json_encode( $this->getBlockAttributes( 'surecart/product-title' ) );
		$this->block_html .= '<!-- wp:surecart/product-title-v2 ' . $attributes . ' /-->';
	}

	/**
	 * Render the product collection badges.
	 *
	 * @return void
	 */
	public function renderProductCollectionBadges() {
		$attributes        = wp_json_encode( $this->getBlockAttributes( 'surecart/product-collection-badges' ) );
		$this->block_html .= '<!-- wp:wp:surecart/product-collection-badges-v2 ' . $attributes . ' /-->';
	}

	/**
	 * Render the product price.
	 *
	 * @return void
	 */
	public function renderProductPrice() {
		$attributes = wp_json_encode( $this->getBlockAttributes( 'surecart/product-price' ) );

		$this->block_html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"0"}},"layout":{"type":"constrained"}} -->';
		$this->block_html .= '<div class="wp-block-group" >';
		$this->block_html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left"}} -->';
		$this->block_html .= '<div class="wp-block-group" >';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-scratch-amount {"style":{"typography":{"textDecoration":"line-through","fontSize":"24px"},"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-amount {"style":{"typography":{"fontSize":"24px"}}} /-->';
		$this->block_html .= '<!-- wp:surecart/product-sale-badge {"text":"Discounted","style":{"border":{"radius":"100px"},"typography":{"fontSize":"12px"},"layout":{"selfStretch":"fit","flexSize":null}}} /-->';
		$this->block_html .= '</div>';
		$this->block_html .= '<!-- /wp:group -->';
		$this->block_html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$this->block_html .= '<div class="wp-block-group" >';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-trial {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->';
		$this->block_html .= '<!-- wp:surecart/product-selected-price-fees {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}}} /-->';
		$this->block_html .= '</div>';
		$this->block_html .= '<!-- /wp:group -->';
		$this->block_html .= '</div>';
		$this->block_html .= '<!-- /wp:group -->';
	}


	/**
	 * Render the product page.
	 *
	 * @return void
	 */
	public function renderProductPage() {
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
	 * Render the new product.
	 *
	 * @return string
	 */
	public function render() {
		$this->renderProductPage();
		return $this->doBlocks();
	}

	/**
	 * Render all blocks.
	 *
	 * @return string
	 */
	public function renderAll() {
		$this->renderProductTitle();
		$this->renderProductCollectionBadges();
		$this->renderProductMedia();
		$this->renderProductPrice();
		return $this->doBlocks();
	}
}
