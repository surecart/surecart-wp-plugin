<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Sale Badge element.
 */
class SaleBadge extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'surecart';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-product-sale-badge';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-sale-badge';

	/**
	 * Element icon
	 *
	 * @var string
	 */
	public $icon = 'ion-md-pricetag';

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-sale-badge';

	/**
	 * Get element label
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Sale Badge', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['text'] = array(
			'label' => esc_html__( 'Text', 'surecart' ),
			'type'  => 'text',
		);
	}

	/**
	 * Render element.
	 */
	public function render() {
		$output  = '<div ' . $this->render_attributes( '_root' ) . '>';
		$output .= $this->html(
			array(
				'text' => ! empty( $this->settings['text'] ) ? $this->settings['text'] : esc_html__( 'Sale', 'surecart' ),
			)
		);
		$output .= '</div>';

		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
