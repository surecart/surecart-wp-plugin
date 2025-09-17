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

		if ( $this->is_admin_editor() ) {
			ob_start();
			?>
			<div>
				<label for="sc-quantity" class="sc-form-label">
					<?php echo esc_html( $label ); ?>
				</label>
				<div class="sc-input-group sc-quantity-selector">
					<div
						class="sc-input-group-text sc-quantity-selector__decrease"
						role="button"
						tabindex="0"
						aria-label="<?php echo esc_attr__( 'Decrease quantity by one.', 'surecart' ); ?>"
					>
						<?php echo wp_kses( \SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() ); ?>
					</div>
					<input
						id="sc-quantity"
						type="number"
						class="sc-form-control sc-quantity-selector__control"
						value="1"
						min="1"
						step="1"
						autocomplete="off"
						role="spinbutton"
					/>
					<div
						class="sc-input-group-text sc-quantity-selector__increase"
						role="button"
						tabindex="0"
						aria-label="<?php echo esc_attr__( 'Increase quantity by one.', 'surecart' ); ?>"
					>
						<?php echo wp_kses( \SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
					</div>
				</div>
			</div>
			<?php
			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				ob_get_clean(),
				'wp-block-surecart-product-quantity'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array(
				'label' => esc_attr( $label ),
			)
		);
	}
}
