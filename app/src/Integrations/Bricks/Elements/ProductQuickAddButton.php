<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Quick Add Button element.
 */
class ProductQuickAddButton extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the bricks class.

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
	public $name = 'surecart-product-quick-add-button';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-quick-view-button';

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
		return esc_html__( 'Product Quick Add Button', 'surecart' );
	}

	/**
	 * Get the default button label.
	 *
	 * @return string
	 */
	protected function get_default_label(): string {
		return esc_html__( 'Add', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		// Design Controls.
		$this->controls['designSeparator'] = [
			'label' => esc_html__( 'Design', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['label'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Button Text', 'surecart' ),
			'type'    => 'text',
			'default' => $this->get_default_label(),
		];

		$this->controls['icon_position'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Icon Position', 'surecart' ),
			'type'        => 'select',
			'options'     => [
				'before' => esc_html__( 'Before', 'surecart' ),
				'after'  => esc_html__( 'After', 'surecart' ),
			],
			'default'     => 'before',
			'inline'      => true,
			'placeholder' => esc_html__( 'Before', 'surecart' ),
		];

		$this->controls['quick_view_button_type'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Icon & Text', 'surecart' ),
			'type'    => 'select',
			'options' => [
				'icon' => esc_html__( 'Icon', 'surecart' ),
				'text' => esc_html__( 'Text', 'surecart' ),
				'both' => esc_html__( 'Both', 'surecart' ),
			],
			'default' => 'both',
			'inline'  => true,
		];

		$this->controls['show_on_hover'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Show on Hover', 'surecart' ),
			'type'        => 'checkbox',
			'description' => esc_html__( 'Show the quick add button only when the product item is hovered.', 'surecart' ),
			'default'     => false,
		];

		// Settings Controls.
		$this->controls['settingsSeparator'] = [
			'label' => esc_html__( 'Settings', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['direct_add_to_cart'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Direct add to cart', 'surecart' ),
			'type'        => 'checkbox',
			'description' => esc_html__( 'Add the product directly to the cart without opening a quick view modal.', 'surecart' ),
			'default'     => true,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$settings = $this->settings;

		// Prepare block attributes.
		$is_add_to_cart = ! empty( $settings['direct_add_to_cart'] );
		$attributes     = array(
			'icon_position'          => $settings['icon_position'] ?? 'before',
			'quick_view_button_type' => $settings['quick_view_button_type'] ?? 'both',
			'direct_add_to_cart'     => $is_add_to_cart,
			'label'                  => $settings['label'] ?? $this->get_default_label(),
			'show_loading_indicator' => true,
			'className'              => $settings['show_on_hover'] ? 'is-style-show-on-hover ' : '',
		);
		echo $this->raw( $attributes );  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
