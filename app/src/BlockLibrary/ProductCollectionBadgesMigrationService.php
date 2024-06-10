<?php

namespace SureCart\BlockLibrary;

/**
 * Provide the migration service for the product collection badges block.
 */
class ProductCollectionBadgesMigrationService {
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
	 * Render the collection badges.
	 *
	 * @return void
	 */
	public function renderProductCollectionBadges() {
		$this->block_html  = '<!-- wp:surecart/product-collection-badges-v2 {"count":' . $this->attributes['count'] . '} -->';
		$this->block_html .= '<!-- wp:surecart/product-collection-badge /-->';
		$this->block_html .= '<!-- /wp:surecart/product-collection-badges-v2 -->';
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
	 * Render the new product collection badges.
	 *
	 * @return string
	 */
	public function render() {
		$this->renderProductCollectionBadges();
		return $this->doBlocks();
	}
}
