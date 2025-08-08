<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Line Item Note element.
 */
class ProductLineItemNote extends \Bricks\Element {
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
	public $name = 'surecart-product-line-item-note';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-line-item-note';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-create';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Line Item Note', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['label'] = array(
			'label'   => esc_html__( 'Label', 'surecart' ),
			'type'    => 'text',
			'default' => esc_html__( 'Note', 'surecart' ),
		);

		$this->controls['placeholder'] = array(
			'label' => esc_html__( 'Placeholder', 'surecart' ),
			'type'  => 'text',
		);

		$this->controls['helpText'] = array(
			'label'       => esc_html__( 'Help Text', 'surecart' ),
			'type'        => 'text',
			'description' => esc_html__( 'Optional text that appears below the note field to provide additional guidance.', 'surecart' ),
		);

		$this->controls['noOfRows'] = array(
			'label'   => esc_html__( 'Number of Rows', 'surecart' ),
			'type'    => 'number',
			'min'     => 1,
			'max'     => 10,
			'default' => 2,
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$label       = ! empty( $this->settings['label'] ) ? $this->settings['label'] : '';
		$placeholder = ! empty( $this->settings['placeholder'] ) ? $this->settings['placeholder'] : esc_html__( 'Add a note (optional)', 'surecart' );
		$help_text   = ! empty( $this->settings['helpText'] ) ? $this->settings['helpText'] : '';
		$no_of_rows  = ! empty( $this->settings['noOfRows'] ) ? absint( $this->settings['noOfRows'] ) : 2;

		if ( $this->is_admin_editor() ) {
			ob_start();
			?>
			<div class="wp-block-surecart-product-line-item-note" data-sc-block-id="product-line-item-note">
				<?php if ( ! empty( $label ) ) : ?>
					<label class="sc-form-label" for="sc_product_note">
						<?php echo wp_kses_post( $label ); ?>
					</label>
				<?php endif; ?>

				<textarea
					class="sc-form-control"
					name="sc_product_note"
					id="sc_product_note"
					placeholder="<?php echo esc_attr( $placeholder ); ?>"
					rows="<?php echo esc_attr( $no_of_rows ); ?>"
					maxlength="500"
				></textarea>

				<?php if ( ! empty( $help_text ) ) : ?>
					<div class="sc-help-text">
						<?php echo wp_kses_post( $help_text ); ?>
					</div>
				<?php endif; ?>
			</div>
			<?php
			$output = ob_get_clean();
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'label'       => wp_kses_post( $label ),
				'placeholder' => esc_attr( $placeholder ),
				'helpText'    => wp_kses_post( $help_text ),
				'noOfRows'    => absint( $no_of_rows ),
			]
		);
	}
}
