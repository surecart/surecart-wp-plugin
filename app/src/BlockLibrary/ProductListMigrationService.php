<?php

namespace SureCart\BlockLibrary;

/**
 * Provide product list migration functionality.
 */
class ProductListMigrationService {
	/**
	 * Attributes.
	 *
	 * @var string
	 */
	public array $attributes = [];

	/**
	 * Block.
	 *
	 * @var string
	 */
	public ?object $block;

	/**
	 * Block HTML.
	 *
	 * @var string
	 */
	public string $block_html = '';

	/**
	 * Inner Blocks.
	 *
	 * @var string
	 */
	public array $inner_blocks = [];

	/**
	 * Set the initial variables.
	 *
	 * @param array $attributes Attributes.
	 */
	public function __construct( $attributes = [], $block = null ) {
		$this->attributes = $attributes;
		$this->block = $block;
		$this->inner_blocks = $block->parsed_block['innerBlocks'] ?? [];
	}

	/**
	 * Get the Child Blocks Attributes.
	 *
	 * @param string $block_name
	 * @return array Child Blocks Attributes.
	 */
	public function getChildBlocksAttributes( $block_name ) {
		if ( empty( $this->inner_blocks ) || empty( $this->inner_blocks[0]['innerBlocks'] ) ) {
			return [];
		}

		foreach ( $this->inner_blocks[0]['innerBlocks'] as $block ) {
			if ( $block['blockName'] === $block_name)  {
				return $block['attrs'];
			}
		}
		return [];
	}

	/**
	 * Render the product list.
	 *
	 * @return void
	 */
	public function renderProductList(): void {
		$limit = $this->attributes['limit'] ?? 15;

		$this->block_html .= '<!-- wp:surecart/product-list {"limit":' . $limit . '} -->';

		$this->renderSortFilterAndSearch();

		$this->renderFilterTags();

		$this->renderProductTemplate();

		$this->renderPagination();

		$this->block_html .= '<!-- /wp:surecart/product-list -->';
	}

	/**
	 * Render the sort, filter and search.
	 *
	 * @return void
	 */
	public function renderSortFilterAndSearch(): void {
		$this->block_html .= '<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->';
		$this->block_html .= '<div class="wp-block-group" style="margin-bottom:10px">';

		$this->renderSortAndFilter();

		$this->renderSearch();

		$this->block_html .= '</div><!-- /wp:group -->';
	}

	/**
	 * Render the sort and filter.
	 *
	 * @return void
	 */
	public function renderSortAndFilter(): void {
		$sort_enabled = wp_validate_boolean( $this->attributes['sort_enabled'] ) ?? true;
		$collection_enabled = wp_validate_boolean( $this->attributes['collection_enabled'] ) ?? true;

		if ( ! $sort_enabled && ! $collection_enabled ) {
			return;
		}

		$this->block_html .= '<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$this->block_html .= '<div class="wp-block-group">';

		if ( $sort_enabled ) {
			$this->block_html .= '<!-- wp:surecart/product-list-sort /-->';
		}

		if ( $collection_enabled ) {
			$this->block_html .= '<!-- wp:surecart/product-list-filter /-->';
		}

		$this->block_html .= '</div><!-- /wp:group -->';
	}

	/**
	 * Render the search.
	 *
	 * @return void
	 */
	public function renderSearch(): void {
		$search_enabled = wp_validate_boolean( $this->attributes['search_enabled'] ) ?? true;

		if ( ! $search_enabled ) {
			return;
		}

		$this->block_html .= '<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$this->block_html .= '<div class="wp-block-group">';
		$this->block_html .= '<!-- wp:surecart/product-list-search /-->';
		$this->block_html .= '</div><!-- /wp:group -->';
	}

	/**
	 * Render the filter tags.
	 *
	 * @return void
	 */
	public function renderFilterTags(): void {
		$collection_enabled = wp_validate_boolean( $this->attributes['collection_enabled'] ) ?? true;

		if ( ! $collection_enabled ) {
			return;
		}

		$this->block_html .= '<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"10px"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$this->block_html .= '<div class="wp-block-group" style="margin-bottom:10px">';
		$this->block_html .= '<!-- wp:surecart/product-list-filter-tags -->';
		$this->block_html .= '<!-- wp:surecart/product-list-filter-tag /-->';
		$this->block_html .= '</div><!-- /wp:group -->';
		$this->block_html .= '</div><!-- /wp:group -->';
	}

	/**
	 * Render the product title.
	 *
	 * @return void
	 */
	public function renderTitle(): void {
		$product_title_attrs = $this->getChildBlocksAttributes( 'surecart/product-item-title' );
		$title_style = ! empty( $product_title_attrs['style'] ) ? wp_json_encode( $product_title_attrs['style'] ) : '{}';
		$this->block_html .= '<!-- wp:surecart/product-title-v2 {"level":0,"style":' . $title_style . '} /-->';
	}

	/**
	 * Render the product image.
	 *
	 * @return void
	 */
	public function renderImage(): void {
		$product_image_attrs = $this->getChildBlocksAttributes( 'surecart/product-item-image' );
		$image_style = ! empty( $product_image_attrs['style'] ) ? wp_json_encode( $product_image_attrs['style'] ) : '{}';
		$this->block_html .= '<!-- wp:surecart/product-image {"style":' . $image_style . '} /-->';
	
	}

	/**
	 * Render the product price.
	 *
	 * @return void
	 */
	public function renderPrice(): void {
		$product_price_attrs = $this->getChildBlocksAttributes( 'surecart/product-item-price' );
		$price_style = ! empty( $product_price_attrs['style'] ) ? wp_json_encode( $product_price_attrs['style'] ) : '{}';
		$this->block_html .= '<!-- wp:surecart/product-price-v2 {"style":' . $price_style . '} /-->';
	}

	/**
	 * Render the product template.
	 *
	 * @return void
	 */
	public function renderProductTemplate(): void {
		$columns = $this->attributes['columns'] ?? 3;
		$this->block_html .= '<!-- wp:surecart/product-template {"layout":{"type":"grid","columnCount":' . $columns . '}} -->';
			$this->renderImage();
			$this->renderTitle();
			$this->renderPrice();
		$this->block_html .= '<!-- /wp:surecart/product-template -->';
	}

	/**
	 * Render the pagination.
	 *
	 * @return void
	 */
	public function renderPagination(): void {
		$pagination_enabled = wp_validate_boolean( $this->attributes['pagination_enabled'] ) ?? true;

		if ( ! $pagination_enabled ) {
			return;
		}

		$this->block_html .= '<!-- wp:surecart/product-pagination -->';
		$this->block_html .= '<!-- wp:surecart/product-pagination-previous /-->';
		$this->block_html .= '<!-- wp:surecart/product-pagination-numbers /-->';
		$this->block_html .= '<!-- wp:surecart/product-pagination-next /-->';
		$this->block_html .= '<!-- /wp:surecart/product-pagination -->';
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
		$this->renderProductList();
		return $this->doBlocks();
	}
}
