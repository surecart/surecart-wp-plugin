<?php

namespace SureCart\BlockLibrary;

/**
 * Provide product list filter tags migration functionality.
 */
class ProductListFilterTagsMigrationService {

	/**
	 * Block HTML.
	 *
	 * @var string
	 */
	public string $block_html = '';

	/**
	 * Render the filter tags.
	 *
	 * @return void
	 */
	public function renderFilterTagsTemplate(): void {
		$this->block_html .= '<!-- wp:surecart/product-list-filter-tags-template -->';
		$this->block_html .= '<!-- wp:surecart/product-list-filter-tag /-->';
	}

	/**
	 * Render the blocks.
	 *
	 * @return string
	 */
	public function doBlocks(): string {
		return do_blocks( $this->block_html );
	}

	/**
	 * Render the new product list.
	 *
	 * @return string
	 */
	public function render(): string {
		$this->renderFilterTagsTemplate();
		return $this->doBlocks();
	}
}
