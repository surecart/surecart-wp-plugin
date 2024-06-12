<?php

namespace SureCart\BlockLibrary;

/**
 * Provide the migration service for the product price choices block.
 */
class ProductPriceChoicesMigrationService {
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
	 * Render the price name.
	 *
	 * @return void
	 */
	public function renderPriceName() {
		$this->block_html .= '<!-- wp:surecart/price-name /-->';
	}

	/**
	 * Render the price amount, trial and setup fee.
	 *
	 * @return void
	 */
	public function renderPriceAmountTrialAndSetupFee() {
		$this->block_html .= '<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->';
		$this->block_html .= '<div class="wp-block-group">';
		$this->block_html .= '<!-- wp:surecart/price-amount {"style":{"elements":{"link":{"color":{"text":"var:preset|color|accent-3"}}},"typography":{"fontStyle":"normal","fontWeight":"700"}},"textColor":"accent-3"} /-->';
		$this->block_html .= '<!-- wp:surecart/price-trial {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}},"fontSize":"small"} /-->';
		$this->block_html .= '<!-- wp:surecart/price-setup-fee {"style":{"color":{"text":"#8a8a8a"},"elements":{"link":{"color":{"text":"#8a8a8a"}}}},"fontSize":"small"} /-->';
		$this->block_html .= '</div>';
		$this->block_html .= '<!-- /wp:group -->';
	}

	/**
	 * Render the price choices.
	 *
	 * @return void
	 */
	public function renderPriceChoices() {
		$attributes = array(
			'label' => __( 'Pricing', 'surecart' ),
		);

		$this->block_html .= '<!-- wp:surecart/product-price-choices-v2 ' . wp_json_encode( $attributes ) . ' -->';
		$this->block_html .= '<!-- wp:surecart/product-price-choice-template -->';
		$this->block_html .= '<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->';
		$this->block_html .= '<div class="wp-block-group">';
		$this->renderPriceName();
		if ( $this->attributes['show-price'] ) {
			$this->renderPriceAmountTrialAndSetupFee();
		}
		$this->block_html .= '</div>';
		$this->block_html .= '<!-- /wp:group -->';
		$this->block_html .= '<!-- /wp:surecart/product-price-choice-template -->';
		$this->block_html .= '<!-- /wp:surecart/product-price-choices-v2 -->';
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
	 * Render the product price choices.
	 *
	 * @return string
	 */
	public function render() {
		$this->renderPriceChoices();
		return $this->doBlocks();
	}
}
