<?php

namespace SureCart\Migration;

/**
 * Product page wrapper service.
 */
class ProductPageWrapperService {

	/**
	 * Content of the page
	 *
	 * @var string
	 */
	protected $content = '';

	/**
	 * Constructor
	 *
	 * @param string $content Content of the page.
	 *
	 * @return void
	 */
	public function __construct( $content ) {
		$this->content = $content;
	}

	/**
	 * Has product page wrapper
	 *
	 * @return boolean
	 */
	public function hasProductPageWrapper() {
		return false !== strpos( $this->content, '<form class="wp-block-surecart-product"' );
	}

	/**
	 * Has custom amount block
	 *
	 * @return boolean
	 */
	public function hasCustomAmountBlock() {
		return false !== strpos( $this->content, '<form class="wp-block-surecart-custom-amount"' );
	}

	/**
	 * Add product page wrapper
	 *
	 * @return string
	 */
	public function addProductPageWrapper() {
		return '<!-- wp:surecart/product-page -->' . $this->content . '<!-- /wp:surecart/product-page -->';
	}

	/**
	 * Add custom amount block
	 *
	 * @return string
	 */
	public function addCustomAmountBlock() {
		return str_replace(
			'<div class="wp-block-button wp-block-surecart-product-buy-button"',
			'<!-- wp:surecart/product-selected-price-ad-hoc-amount /-->' . PHP_EOL . '<div class="wp-block-button wp-block-surecart-product-buy-button"',
			$this->content
		);
	}

	/**
	 * Handle product page wrapper
	 *
	 * @return string
	 */
	public function wrap(): string {
		if ( ! is_singular( 'sc_product' ) ) {
			return $this->content;
		}

		if ( ! $this->hasProductPageWrapper() ) {
			$this->content = $this->addProductPageWrapper();
		}

		if ( ! $this->hasCustomAmountBlock() ) {
			$this->content = $this->addCustomAmountBlock();
		}

		return do_blocks( $this->content );
	}
}
