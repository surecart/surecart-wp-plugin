<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


/**
 * Selected Price element.
 */
class SelectedPrice extends \Bricks\Element {
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
	public $name = 'surecart-product-selected-price';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-selected-price';

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
		return esc_html__( 'Selected Price', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		$row_block_settings = array(
			'_direction'      => 'row',
			'_justifyContent' => 'flex-start',
			'_alignItems'     => 'baseline',
			'_columnGap'      => '0.5em',
		);

		return array(
			array(
				'name'     => 'block',
				'settings' => $row_block_settings,
				'children' => array(
					array( 'name' => 'surecart-product-selected-price-scratch-amount' ),
					array( 'name' => 'surecart-product-selected-price-amount' ),
					array( 'name' => 'surecart-product-selected-price-interval' ),
					array( 'name' => 'surecart-product-sale-badge' ),
				),
			),
			array(
				'name'     => 'block',
				'settings' => $row_block_settings,
				'children' => array(
					array( 'name' => 'surecart-product-selected-price-trial' ),
					array( 'name' => 'surecart-product-selected-price-fees' ),
				),
			),
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$output = "<div {$this->render_attributes( '_root' )}>";

		// Render children elements (= individual items).
		$output .= \Bricks\Frontend::render_children( $this );

		$output .= '</div>';

		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
