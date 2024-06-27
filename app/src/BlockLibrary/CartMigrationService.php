<?php

namespace SureCart\BlockLibrary;

/**
 * Provide cart migration functionality.
 */
class CartMigrationService {
	/**
	 * Attributes.
	 *
	 * @var string
	 */
	public array $attributes = array();

	/**
	 * Block.
	 *
	 * @var string
	 */
	public ?object $block;

	/**
	 * Block HTML.
	 *
	 * @var string
	 */
	public string $block_html = '';

	/**
	 * Inner Blocks.
	 *
	 * @var array
	 */
	public array $inner_blocks = array();

	/**
	 * Set the initial variables.
	 *
	 * @param array  $attributes Attributes.
	 * @param object $block Block.
	 */
	public function __construct( $attributes = array(), $block = null ) {
		$this->attributes   = $attributes;
		$this->block        = $block;
		$this->inner_blocks = $block->parsed_block['innerBlocks'] ?? [];
	}

	/**
	 * Get the Child Blocks Attributes.
	 *
	 * @param string $block_name Block Name.
	 * @return array             Child Blocks Attributes.
	 */
	public function getChildBlocksAttributes( $block_name ) {
		if ( empty( $this->inner_blocks ) ) {
			return array();
		}

		foreach ( $this->inner_blocks as $block ) {
			if ( $block['blockName'] === $block_name ) {
				return $block['attrs'];
			}
		}

		return array();
	}

	/**
	 * Render the cart header element.
	 *
	 * @return void
	 */
	public function renderCartHeader(): void {
		$text        = $this->attributes['text'] ?? '';
		$text_string = $text ? 'text="' . $text . '"' : '';

		$this->block_html .= '<!-- wp:surecart/cart-header-v2 {' . $text_string . ', ' . $this->getCartStyle() . '} /-->';
	}

	/**
	 * Render the cart items element.
	 *
	 * @return void
	 */
	public function renderCartItems(): void {
		$removable = $this->attributes['removable'] ?? false;
		$editable  = $this->attributes['editable'] ?? false;

		$removable_string = ! $removable ? 'removable="false"' : '';
		$editable_string  = ! $editable ? 'editable="false"' : '';

		$this->block_html .= '<!-- wp:surecart/cart-items-v2 {' . $removable_string . ', ' . $editable_string . ', ' . $this->getCartStyle() . '} /-->';
	}

	/**
	 * Render the cart coupon element.
	 *
	 * @return void
	 */
	public function renderCartCoupon(): void {
		$text        = $this->attributes['text'] ?? '';
		$text_string = $text ? 'text="' . $text . '"' : '';

		$button_text        = $this->attributes['buttonText'] ?? '';
		$button_text_string = 'buttonText="' . $button_text . '"';

		$placeholder        = $this->attributes['placeholder'] ?? '';
		$placeholder_string = 'placeholder="' . $placeholder . '"';

		$collapsed        = $this->attributes['collapsed'] ?? false;
		$collapsed_string = ! $collapsed ? 'collapsed="false"' : '';

		$this->block_html .= '<!-- wp:surecart/cart-coupon-v2 {' . $text_string . ', ' . $button_text_string . ', ' . $placeholder_string . ', ' . $collapsed_string . ', ' . $this->getCartStyle() . '} /-->';
	}

	/**
	 * Render the cart subtotal element.
	 *
	 * @return void
	 */
	public function renderCartSubtotal(): void {
		$label        = $this->attributes['label'] ?? '';
		$label_string = $label ? 'label="' . $label . '"' : '';

		$this->block_html .= '<!-- wp:surecart/cart-subtotal-v2 {' . $label_string . ', ' . $this->getCartStyle() . '} /-->';
	}

	/**
	 * Render the cart bump line item element.
	 *
	 * @return void
	 */
	public function renderCartBumpLineItem(): void {
		$label        = $this->attributes['label'] ?? '';
		$label_string = $label ? 'label="' . $label . '"' : '';

		$this->block_html .= '<!-- wp:surecart/cart-bump-line-item-v2 {' . $label_string . ', ' . $this->getCartStyle() . '} /-->';
	}

	/**
	 * Render the cart submit element.
	 *
	 * @return void
	 */
	public function renderCartSubmit(): void {
		$text        = $this->attributes['text'] ?? '';
		$text_string = $text ? 'text="' . $text . '"' : '';

		$this->block_html .= '<!-- wp:surecart/cart-submit-v2 {' . $text_string . ', ' . $this->getCartStyle() . '} /-->';
	}

	/**
	 * Render the cart message element.
	 *
	 * @return void
	 */
	public function renderCartMessage(): void {
		$text = $this->attributes['text'] ?? '';
		if ( empty( $text ) ) {
			return;
		}

		$text_string = $text ? 'text="' . $text . '"' : '';

		$this->block_html .= '<!-- wp:surecart/cart-message-v2 {' . $text_string . '} /-->';
	}

	/**
	 * Get cart element generic styles.
	 *
	 * @return string
	 */
	public function getCartStyle(): string {
		$padding        = isset( $this->attributes['padding'] ) ? $this->attributes['padding'] : '';
		$padding_string = 'padding="' . $padding['top'] . ' ' . $padding['right'] . ' ' . $padding['bottom'] . ' ' . $padding['left'] . '"';

		$border        = isset( $this->attributes['border'] ) ? true : false;
		$border_string = ! $border ? 'border="false"' : '';

		$background_color_string = isset( $this->attributes['backgroundColor'] ) ? 'backgroundColor="' . $this->attributes['backgroundColor'] . '"' : '';
		$text_color_string       = isset( $this->attributes['textColor'] ) ? 'textColor="' . $this->attributes['textColor'] . '"' : '';

		return $padding_string . ', ' . $border_string . ', ' . $background_color_string . ', ' . $text_color_string;
	}

	/**
	 * Render the cart template.
	 *
	 * @return void
	 */
	public function renderCartTemplate(): void {
		$cart_block_attrs = wp_json_encode( $this->getChildBlocksAttributes( 'surecart/cart-v2' ), JSON_FORCE_OBJECT );
		$this->block_html .= '<!-- wp:surecart/cart-v2 ' . $cart_block_attrs . ' -->';

		// Render according to the inner blocks order in old block.
		if ( ! empty( $this->inner_blocks ) ) {
			foreach ( $this->inner_blocks as $inner_block ) {
				switch ( $inner_block['blockName'] ) {
					case 'surecart/cart-header-v2':
						$this->renderCartHeader();
						break;
					case 'surecart/cart-items-v2':
						$this->renderCartItems();
						break;
					case 'surecart/cart-coupon-v2':
						$this->renderCartCoupon();
						break;
					case 'surecart/cart-subtotal-v2':
						$this->renderCartSubtotal();
						break;
					case 'surecart/cart-bump-line-item-v2':
						$this->renderCartBumpLineItem();
						break;
					case 'surecart/cart-submit-v2':
						$this->renderCartSubmit();
						break;
					case 'surecart/cart-message-v2':
						$this->renderCartMessage();
						break;
				}
			}
		}
		$this->block_html .= '<!-- /wp:surecart/cart-v2 -->';
	}

	/**
	 * Render the blocks.
	 *
	 * @return string
	 */
	public function doBlocks(): string {
		return do_blocks( $this->block_html );
	}

	/**
	 * Render the new product list.
	 *
	 * @return string
	 */
	public function render(): string {
		$this->renderCartTemplate();
		return $this->doBlocks();
	}
}
