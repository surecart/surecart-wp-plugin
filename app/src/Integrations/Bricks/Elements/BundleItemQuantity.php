<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bundle Item Quantity element.
 */
class BundleItemQuantity extends \Bricks\Element {
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
	public $name = 'surecart-bundle-item-quantity';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/bundle-item-quantity';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-calculator';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Bundle Item Quantity', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['show_single_quantity'] = array(
			'label'       => esc_html__( 'Show Single Quantity', 'surecart' ),
			'type'        => 'checkbox',
			'description' => esc_html__( 'Show the quantity even when it is 1.', 'surecart' ),
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				esc_html__( '× 2', 'surecart' ),
				'sc-bundle-item__qty wp-block-surecart-bundle-item-quantity',
				'span'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array(
				'showSingleQuantity' => ! empty( $this->settings['show_single_quantity'] ),
			)
		);
	}
}
