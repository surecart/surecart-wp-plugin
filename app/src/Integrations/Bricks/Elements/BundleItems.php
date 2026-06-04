<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bundle Items element.
 */
class BundleItems extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Elements';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-product-bundle-items';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-bundle-items';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-cube';

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
		return esc_html__( 'Product Bundle Items', 'surecart' );
	}

	/**
	 * Enqueue element styles.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_style( 'surecart-pill' );
		wp_enqueue_style( 'surecart-product-variants' );
		wp_enqueue_style( 'surecart-product-bundle-items-style' );
		wp_enqueue_style( 'surecart-bundle-item-template-style' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		return array(
			array(
				'name'     => 'surecart-bundle-item-template',
				'children' => array(
					array(
						'name'     => 'block',
						'label'    => esc_html__( 'Bundle Item Label', 'surecart' ),
						'settings' => array(
							'_direction'  => 'row',
							'_alignItems' => 'baseline',
							'_columnGap'  => '4px',
						),
						'children' => array(
							array( 'name' => 'surecart-bundle-product-name' ),
							array( 'name' => 'surecart-bundle-variant-name' ),
							array( 'name' => 'surecart-bundle-item-quantity' ),
						),
					),
					array( 'name' => 'surecart-bundle-item-variant' ),
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
		if ( $this->is_admin_editor() ) {
			$output  = '<ul class="sc-bundle-items__list">';
			$output .= '<li class="sc-bundle-items__item">';
			$output .= \Bricks\Frontend::render_children( $this );
			$output .= '</li>';
			$output .= '</ul>';

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$output,
				'wp-block-surecart-product-bundle-items sc-bundle-items'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array(),
			\Bricks\Frontend::render_children( $this )
		);
	}
}
