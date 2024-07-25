<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product element.
 */
class Media extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the bricks class.

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
	public $name = 'surecart-product-media';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-media';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-slider-alt';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product media', 'surecart' );
	}

	/**
	 * Set control groups.
	 */
	public function set_control_groups() {
		$this->control_groups['text'] = [ // Unique group identifier (lowercase, no spaces)
			'title' => esc_html__( 'Text', 'bricks' ), // Localized control group title
			'tab'   => 'content', // Set to either "content" or "style"
		];

		$this->control_groups['settings'] = [
			'title' => esc_html__( 'Settings', 'bricks' ),
			'tab'   => 'content',
		];
	}

	// Set builder controls
	public function set_controls() {
		$this->controls['content'] = [ // Unique control identifier (lowercase, no spaces)
			'tab'     => 'content', // Control tab: content/style
			'group'   => 'text', // Show under control group
			'label'   => esc_html__( 'Content', 'bricks' ), // Control label
			'type'    => 'text', // Control type
			'default' => esc_html__( 'Content goes here ..', 'bricks' ), // Default setting
		];

		$this->controls['type'] = [
			'tab'         => 'content',
			'group'       => 'settings',
			'label'       => esc_html__( 'Type', 'bricks' ),
			'type'        => 'select',
			'options'     => [
				'info'    => esc_html__( 'Info', 'bricks' ),
				'success' => esc_html__( 'Success', 'bricks' ),
				'warning' => esc_html__( 'Warning', 'bricks' ),
				'danger'  => esc_html__( 'Danger', 'bricks' ),
				'muted'   => esc_html__( 'Muted', 'bricks' ),
			],
			'inline'      => true,
			'clearable'   => false,
			'pasteStyles' => false,
			'default'     => 'info',
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		echo $this->html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
