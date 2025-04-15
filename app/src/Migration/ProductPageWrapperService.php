<?php

namespace SureCart\Migration;

/**
 * Product page wrapper service.
 */
class ProductPageWrapperService {

	/**
	 * Content of the page.
	 *
	 * @var string
	 */
	protected $content = '';

	/**
	 * Constructor.
	 *
	 * @param string $content Content of the page.
	 *
	 * @return void
	 */
	public function __construct( $content ) {
		$this->content = $content;
	}

	/**
	 * Has product page wrapper.
	 *
	 * @return boolean
	 */
	public function hasProductPageWrapper() {
		return preg_match( '/wp:surecart\/product-page|data-sc-block-id\s*=\s*(?:"product-page"|\'product-page\'|\\"product-page\\"|\\\'product-page\\\')/', $this->content );
	}

	/**
	 * Has any surecart product block.
	 *
	 * @return boolean
	 */
	public function hasAnySureCartProductBlock(): bool {
		// Check for blocks starting with wp:surecart/product- or wp:surecart/price-, or wp-surecart-product- or wp-surecart-price-.
		return preg_match( '/wp:surecart\/product-|wp:surecart\/price-|wp-surecart-product-|wp-surecart-price-|class="wp-block-surecart-|data-widget_type="surecart-/', $this->content );
	}

	/**
	 * Has product buy button.
	 *
	 * @return boolean
	 */
	public function hasProductBuyButton() {
		return preg_match( '/wp:surecart\/product-buy-button|data-sc-block-id\s*=\s*(?:"product-buy-button"|\'product-buy-button\'|\\"product-buy-button\\"|\\\'product-buy-button\\\')/', $this->content );
	}

	/**
	 * Has custom amount block.
	 *
	 * @return boolean
	 */
	public function hasCustomAmountBlock() {
		return preg_match( '/wp:surecart\/custom-amount|data-sc-block-id\s*=\s*(?:"custom-amount"|\'custom-amount\'|\\"custom-amount\\"|\\\'custom-amount\\\')/', $this->content );
	}

	/**
	 * Add product page wrapper.
	 *
	 * @return string
	 */
	public function addProductPageWrapper() {
		return '<!-- wp:surecart/product-page {"align":"wide"} -->' . $this->content . '<!-- /wp:surecart/product-page -->';
	}

	/**
	 * Add custom amount block.
	 *
	 * @return string
	 */
	public function addCustomAmountBlock() {
		return str_replace(
			'<div class="wp-block-button  has-custom-width wp-block-button__width-100 wp-block-surecart-product-buy-button"',
			'<!-- wp:surecart/product-selected-price-ad-hoc-amount /-->' . PHP_EOL . '<div class="wp-block-button  has-custom-width wp-block-button__width-100 wp-block-surecart-product-buy-button"',
			$this->content
		);
	}

	/**
	 * Handle product page wrapper
	 *
	 * @return string
	 */
	public function wrap(): string {
		// need to be a product page.
		if ( ! is_singular( 'sc_product' ) ) {
			return $this->content;
		}

		// need to have a product buy button.
		if ( ! $this->hasProductBuyButton() ) {
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
