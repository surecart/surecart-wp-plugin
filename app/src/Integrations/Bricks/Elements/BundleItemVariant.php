<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bundle Item Variant element.
 */
class BundleItemVariant extends \Bricks\Element {
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
	public $name = 'surecart-bundle-item-variant';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/bundle-item-variant';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-radio-button-on';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Bundle Item Variant', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['highlight_text'] = array(
			'label' => esc_html__( 'Highlight Text Color', 'surecart' ),
			'type'  => 'color',
			'css'   => [
				[
					'property'  => 'color',
					'selector'  => '.sc-pill-option__button--selected',
					'important' => true,
				],
			],
		);

		$this->controls['highlight_background'] = array(
			'label' => esc_html__( 'Highlight Background Color', 'surecart' ),
			'type'  => 'color',
			'css'   => [
				[
					'property'  => 'background-color',
					'selector'  => '.sc-pill-option__button--selected',
					'important' => true,
				],
			],
		);

		$this->controls['highlight_border'] = array(
			'label' => esc_html__( 'Highlight Border Color', 'surecart' ),
			'type'  => 'color',
			'css'   => [
				[
					'property'  => 'border-color',
					'selector'  => '.sc-pill-option__button--selected',
					'important' => true,
				],
			],
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			$output  = '<span class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill sc-pill-option__button--selected">' . esc_html__( 'Small', 'surecart' ) . '</span>';
			$output .= '<span class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill">' . esc_html__( 'Medium', 'surecart' ) . '</span>';
			$output .= '<span class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill">' . esc_html__( 'Large', 'surecart' ) . '</span>';

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$output,
				'wp-block-surecart-bundle-item-variant sc-pill-option__wrapper'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array(),
			'<!-- wp:surecart/bundle-item-variant-pill ' . wp_json_encode(
				array(
					'highlight_text'       => esc_attr( $this->get_raw_color( 'highlight_text' ) ),
					'highlight_background' => esc_attr( $this->get_raw_color( 'highlight_background' ) ),
					'highlight_border'     => esc_attr( $this->get_raw_color( 'highlight_border' ) ),
				),
				JSON_FORCE_OBJECT
			) . ' /-->'
		);
	}
}
