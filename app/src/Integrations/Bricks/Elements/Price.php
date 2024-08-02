<?php


namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price element.
 */
class Price extends \Bricks\Element {
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
	public $name = 'surecart-product-price';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-price';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-money';

	/**
	 * This is nestable.
	 *
	 * @var bool
	 */
	public $nestable = true;

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-price';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Price', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array[]
	 */
	public function get_nestable_children() {
		return array(
			array( 'name' => 'surecart-product-price-name' ),
			array(
				'name'     => 'block',
				'settings' => array(
					'_hidden'         => array( '_cssClasses' => 'hidden-class' ),
					'_direction'      => 'column',
					'_justifyContent' => 'flex-end',
					'_alignItems'     => 'flex-start',
				),
				'children' => array(
					array( 'name' => 'surecart-product-price-amount' ),
					array( 'name' => 'surecart-product-price-trial' ),
					array( 'name' => 'surecart-product-price-setup-fee' ),
				),
			),
		);
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['highlight_border'] = array(
			'label'   => esc_html__( 'Highlight Border', 'surecart' ),
			'type'    => 'color',
			'default' => '#000000',
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if (  bricks_is_builder_call() ) {
			$output  = "<div  class='sc-choice' {$this->render_attributes('_root')}>";
			$output .= \Bricks\Frontend::render_children( $this );
			$output .= '</div>';

			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		echo "<div {$this->render_attributes( '_root' )}>" . $this->raw(  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array(
				'highlight_border' => $this->settings['highlight_border'] ?? '#000000',
			),
			\Bricks\Frontend::render_children( $this )
		) . '</div>';
	}
}
