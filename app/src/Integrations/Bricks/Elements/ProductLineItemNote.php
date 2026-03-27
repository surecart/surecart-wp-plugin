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
		return esc_html__( 'Product Note', 'surecart' );
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

		$this->controls['help_text'] = array(
			'label'       => esc_html__( 'Help text', 'surecart' ),
			'type'        => 'text',
			'description' => esc_html__( 'Optional text that appears below the note field to provide additional guidance.', 'surecart' ),
		);

		// Label Style Controls.
		$this->controls['labelStyleSeparator'] = [
			'label' => esc_html__( 'Label style', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['labelTypography'] = [
			'label' => esc_html__( 'Typography', 'surecart' ),
			'type'  => 'typography',
			'css'   => [
				[
					'property' => 'font',
					'selector' => '.sc-form-label',
				],
			],
		];

		$this->controls['labelColor'] = [
			'label' => esc_html__( 'Text color', 'surecart' ),
			'type'  => 'color',
			'css'   => [
				[
					'property' => 'color',
					'selector' => '.sc-form-label',
				],
			],
		];

		$this->controls['labelMargin'] = [
			'label' => esc_html__( 'Margin', 'surecart' ),
			'type'  => 'spacing',
			'css'   => [
				[
					'property' => 'margin',
					'selector' => '.sc-form-label',
				],
			],
		];

		// Input Field Style Controls.
		$this->controls['inputFieldStyleSeparator'] = [
			'label' => esc_html__( 'Input field style', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['inputFieldTypography'] = [
			'label' => esc_html__( 'Typography', 'surecart' ),
			'type'  => 'typography',
			'css'   => [
				[
					'property' => 'font',
					'selector' => '.sc-form-control',
				],
			],
		];

		$this->controls['inputFieldColor'] = [
			'label' => esc_html__( 'Text color', 'surecart' ),
			'type'  => 'color',
			'css'   => [
				[
					'property' => 'color',
					'selector' => '.sc-form-control',
				],
			],
		];

		$this->controls['inputFieldBackgroundColor'] = [
			'label' => esc_html__( 'Background color', 'surecart' ),
			'type'  => 'color',
			'css'   => [
				[
					'property' => 'background-color',
					'selector' => '.sc-form-control',
				],
			],
		];

		$this->controls['inputFieldBorder'] = [
			'label' => esc_html__( 'Border', 'surecart' ),
			'type'  => 'border',
			'css'   => [
				[
					'property' => 'border',
					'selector' => '.sc-form-control',
				],
			],
		];

		$this->controls['inputFieldPadding'] = [
			'label' => esc_html__( 'Padding', 'surecart' ),
			'type'  => 'spacing',
			'css'   => [
				[
					'property' => 'padding',
					'selector' => '.sc-form-control',
				],
			],
		];

		$this->controls['inputFieldMargin'] = [
			'label' => esc_html__( 'Margin', 'surecart' ),
			'type'  => 'spacing',
			'css'   => [
				[
					'property' => 'margin',
					'selector' => '.sc-form-control',
				],
			],
		];

		// Help Text Style Controls.
		$this->controls['helpTextStyleSeparator'] = [
			'label' => esc_html__( 'Help text style', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['helpTextTypography'] = [
			'label' => esc_html__( 'Typography', 'surecart' ),
			'type'  => 'typography',
			'css'   => [
				[
					'property' => 'font',
					'selector' => '.sc-help-text',
				],
			],
		];

		$this->controls['helpTextColor'] = [
			'label' => esc_html__( 'Text color', 'surecart' ),
			'type'  => 'color',
			'css'   => [
				[
					'property' => 'color',
					'selector' => '.sc-help-text',
				],
			],
		];

		$this->controls['helpTextMargin'] = [
			'label' => esc_html__( 'Margin', 'surecart' ),
			'type'  => 'spacing',
			'css'   => [
				[
					'property' => 'margin',
					'selector' => '.sc-help-text',
				],
			],
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$label       = ! empty( $this->settings['label'] ) ? $this->settings['label'] : '';
		$placeholder = ! empty( $this->settings['placeholder'] ) ? $this->settings['placeholder'] : esc_html__( 'Add a note (optional)', 'surecart' );
		$help_text   = ! empty( $this->settings['help_text'] ) ? $this->settings['help_text'] : '';

		if ( $this->is_admin_editor() ) {
			ob_start();
			?>
			<div>
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
					rows="1"
					onfocus="this.rows=3"
					maxlength="485"
				></textarea>

				<?php if ( ! empty( $help_text ) ) : ?>
					<div class="sc-help-text">
						<?php echo wp_kses_post( $help_text ); ?>
					</div>
				<?php endif; ?>
			</div>
			<?php
			$output = ob_get_clean();
			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$output,
				'wp-block-surecart-product-line-item-note'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'label'       => wp_kses_post( $label ),
				'placeholder' => esc_attr( $placeholder ),
				'help_text'   => wp_kses_post( $help_text ),
			]
		);
	}
}
