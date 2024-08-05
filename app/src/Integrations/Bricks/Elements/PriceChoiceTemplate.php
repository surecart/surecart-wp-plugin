<?php


namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Choice Template element.
 */
class PriceChoiceTemplate extends \Bricks\Element {
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
	public $name = 'surecart-product-price-choice-template';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-price-choice-template';

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
		if ( bricks_is_builder_call() ) {
			echo $this->preview_layout( 'sc-choice' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		echo $this->raw_layout(
			[
				'highlight_border' => $this->settings['highlight_border'],
			]
		);
	}
}
