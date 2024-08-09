<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Variant Pill element.
 */
class VariantPill extends \Bricks\Element {
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
	public $name = 'surecart-product-variant-pill';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-variant-pill';

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
	public $css_selector = '.wp-block-surecart-product-variant-pill';

	/**
	 * Get element label
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Variant Pill', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['highlight_text'] = array(
			'label' => esc_html__( 'Highlight Text Color', 'surecart' ),
			'type'  => 'color',
		);

		$this->controls['highlight_background'] = array(
			'label' => esc_html__( 'Highlight Background Color', 'surecart' ),
			'type'  => 'color',
		);

		$this->controls['highlight_border'] = array(
			'label' => esc_html__( 'Highlight Border Color', 'surecart' ),
			'type'  => 'color',
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$output = '';

		if ( $this->is_admin_editor() ) {
			$output .= '<div ' . $this->render_attributes( '_root' ) . '>';
			$output .= '<span class="sc-pill-option__button wp-block-surecart-product-variant-pill">' . esc_html__( 'Red', 'surecart' ) . '</span>';
			$output .= '</div>';

			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		$output = '<div ' . $this->render_attributes( '_root' ) . '>' . $this->raw(
			[
				'highlight_text'       => $this->settings['highlight_text']['hex'] ?? '',
				'highlight_background' => $this->settings['highlight_background']['hex'] ?? '',
				'highlight_border'     => $this->settings['highlight_border']['hex'] ?? '',
			]
		) . '</div>';
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
