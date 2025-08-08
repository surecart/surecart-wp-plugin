<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Quantity element.
 */
class Quantity extends \Bricks\Element {
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
	public $name = 'surecart-product-quantity';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-quantity';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-plus';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Quantity', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['label'] = array(
			'label' => esc_html__( 'Label', 'surecart' ),
			'type'  => 'text',
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$label = ! empty( $this->settings['label'] ) ? $this->settings['label'] : esc_html__( 'Quantity', 'surecart' );

		// If we're in admin editor mode, render HTML directly for preview.
		if ( $this->is_admin_editor() ) {
			$rendered_attributes = $this->get_block_rendered_attributes();
			$class               = $rendered_attributes['class'];
			$id                  = $rendered_attributes['id'];

			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '">';
			echo '<label for="sc-quantity" class="sc-form-label">';
			echo esc_html( $label );
			echo '</label>';
			echo '<div class="sc-input-group sc-quantity-selector">';
			echo '<div class="sc-input-group-text sc-quantity-selector__decrease" role="button" tabindex="0" aria-label="' . esc_attr__( 'Decrease quantity by one.', 'surecart' ) . '">';
			echo wp_kses( \SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() );
			echo '</div>';
			echo '<input id="sc-quantity" type="number" class="sc-form-control sc-quantity-selector__control" value="1" min="1" step="1" autocomplete="off" role="spinbutton" />';
			echo '<div class="sc-input-group-text sc-quantity-selector__increase" role="button" tabindex="0" aria-label="' . esc_attr__( 'Increase quantity by one.', 'surecart' ) . '">';
			echo wp_kses( \SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() );
			echo '</div>';
			echo '</div>';
			echo '</div>';
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				array(
					'label' => esc_attr( $label ),
				)
			);
		}
	}
}
