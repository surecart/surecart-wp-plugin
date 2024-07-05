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
	public array $attributes = array();

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
		$text_color        = $this->attributes['textColor'] ?? '#8a8a8a';
		$this->block_html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"right"}} -->';
		$this->block_html .= '<div class="wp-block-group">';
		$this->block_html .= '<!-- wp:surecart/price-amount {"style":{"elements":{"link":{"color":{"text":"var:preset|color|accent-3"}}},"typography":{"fontStyle":"normal","fontWeight":"700"}},"textColor":"accent-3"} /-->';
		$this->block_html .= '<!-- wp:surecart/price-trial {"style":{"color":{"text":"' . $text_color . '"},"elements":{"link":{"color":{"text":"' . $text_color . '"}}}},"fontSize":"small"} /-->';
		$this->block_html .= '<!-- wp:surecart/price-setup-fee {"style":{"color":{"text":"' . $text_color . '"},"elements":{"link":{"color":{"text":"' . $text_color . '"}}}},"fontSize":"small"} /-->';
		$this->block_html .= '</div>';
		$this->block_html .= '<!-- /wp:group -->';
	}

	/**
	 * Render the price choices.
	 *
	 * @return void
	 */
	public function renderPriceChoices() {
		$choices_attributes = array(
			'label' => $this->attributes['label'] ?? __( 'Pricing', 'surecart' ),
		);

		$template_attributes = array(
			'textColor'       => $this->attributes['textColor'] ?? 'black',
			'backgroundColor' => $this->attributes['backgroundColor'] ?? 'white',
			'style'           => array(
				'elements' => array(
					'link' => array(
						'color' => array(
							'text' => $this->attributes['elements']['link']['color']['text'] ?? '#8a8a8a',
						),
					),
				),
			),
		);

		$this->block_html .= '<!-- wp:surecart/product-price-chooser ' . wp_json_encode( $choices_attributes ) . ' -->';
		$this->block_html .= '<!-- wp:surecart/product-price-choices-template {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"grid","columnCount":2,"justifyContent":"stretch","orientation":"vertical","flexWrap":"nowrap","verticalAlignment":"center"}} -->';
		$this->block_html .= '<!-- wp:surecart/product-price-choice-template ' . wp_json_encode( $template_attributes ) . ' -->';
		$this->renderPriceName();
		if ( $this->attributes['show_price'] ) {
			$this->renderPriceAmountTrialAndSetupFee();
		}
		$this->block_html .= '<!-- /wp:surecart/product-price-choice-template -->';
		$this->block_html .= '<!-- /wp:surecart/product-price-choices-template -->';
		$this->block_html .= '<!-- /wp:surecart/product-price-chooser -->';
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
		error_log( $this->block_html );
		return $this->doBlocks();
	}
}
