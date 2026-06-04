<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bundle Item Template element.
 */
class BundleItemTemplate extends \Bricks\Element {
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
	public $name = 'surecart-bundle-item-template';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/bundle-item-template';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-list';

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
		return esc_html__( 'Bundle Item Template', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		return array(
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
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			$output  = '<div class="sc-bundle-item__row">';
			$output .= \Bricks\Frontend::render_children( $this );
			$output .= '</div>';

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$output,
				'wp-block-surecart-bundle-item-template sc-bundle-item'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array(
				'layout' => array(
					'type'        => 'flex',
					'orientation' => 'vertical',
				),
			),
			\Bricks\Frontend::render_children( $this )
		);
	}
}
