<?php


namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Selector element.
 */
class PriceChooser extends \Bricks\Element {
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
	public $name = 'surecart-product-price-chooser';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-price-chooser';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'fas fa-money-bills';

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

	/**
	 * The constructor.
	 *
	 * @param \Bricks\Element|null $element The element.
	 *
	 * @return void
	 */
	public function __construct( $element = null ) {
		$element['settings']['_width'] = '100%';
		parent::__construct( $element );
	}

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Price Chooser', 'surecart' );
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
			'default' => esc_html__( 'Pricing', 'surecart' ),
		);
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		return array(
			array(
				'name'     => 'surecart-product-price-choice-template',
				'settings' => array(
					'_display'        => 'flex',
					'_direction'      => 'row',
					'_justifyContent' => 'flex-start',
					'_alignItems'     => 'center',
					'_width'          => '100%',
					'_gap'            => '0',
				),
				'children' => ( new PriceChoiceTemplate() )->get_nestable_children(),
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
			$label = ! empty( $this->settings['label'] ) ? $this->settings['label'] : esc_html__( 'Pricing', 'surecart' );

			$output  = "<label class='sc-form-label'>" . $label . '</label>';
			$output .= "<div class='sc-choices'>";
			$output .= \Bricks\Frontend::render_children( $this );
			$output .= '</div>';

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$output,
				'wp-block-surecart-product-price-chooser'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'label' => $this->settings['label'],
			],
			\Bricks\Frontend::render_children( $this )
		);
	}
}
