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

		// Settings Controls.
		$this->controls['settingsSeparator'] = [
			'label' => esc_html__( 'Settings', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['direct_add_to_cart'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Direct add to cart', 'surecart' ),
			'type'        => 'checkbox',
			'description' => esc_html__( 'Add the product directly to the cart if it has no options.', 'surecart' ),
			'default'     => true,
		];

		$this->controls['iconSeparator'] = [
			'label' => esc_html__( 'Icon', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['icon'] = [
			'label'   => esc_html__( 'Icon', 'surecart' ),
			'type'    => 'icon',
			'default' => array(
				'library' => 'fontawesomeSolid',
				'icon'    => 'fas fa-plus',
			),
		];

		$this->controls['iconTypography'] = [
			'label'    => esc_html__( 'Typography', 'surecart' ),
			'type'     => 'typography',
			'css'      => [
				[
					'property' => 'font',
					'selector' => 'i',
				],
			],
			'required' => [ 'icon.icon', '!=', '' ],
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

		$this->controls['styleSeparator'] = [
			'label' => esc_html__( 'Style', 'surecart' ),
			'type'  => 'separator',
		];

		$this->controls['size'] = [
			'label'       => esc_html__( 'Size', 'surecart' ),
			'type'        => 'select',
			'options'     => $this->control_options['buttonSizes'],
			'inline'      => true,
			'reset'       => true,
			'placeholder' => esc_html__( 'Default', 'surecart' ),
		];

		$this->controls['style'] = [
			'label'       => esc_html__( 'Style', 'surecart' ),
			'type'        => 'select',
			'options'     => $this->control_options['styles'],
			'inline'      => true,
			'reset'       => true,
			'default'     => 'primary',
			'placeholder' => esc_html__( 'None', 'surecart' ),
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$settings            = $this->settings;
		$product_id          = get_the_ID();
		$product             = sc_get_product();
		$is_add_to_cart      = ! empty( $settings['direct_add_to_cart'] );
		$should_direct_add   = $is_add_to_cart && empty( $product->has_options );
		$attributes          = array(
			'icon_position'          => $settings['icon_position'] ?? 'before',
			'quick_view_button_type' => $settings['quick_view_button_type'] ?? 'both',
			'label'                  => $settings['label'] ?? $this->get_default_label(),
		);
		$show_icon           = in_array( $attributes['quick_view_button_type'], [ 'icon', 'both' ], true ) && ! empty( $settings['icon'] );
		$show_text           = in_array( $attributes['quick_view_button_type'], [ 'text', 'both' ], true );
		$quick_view_link     = add_query_arg( 'product-quick-view', $product_id );
		$is_disabled         = empty( $quick_view_link ) ? 'true' : null;

		if ( $should_direct_add ) {
			$is_disabled = empty( $product->in_stock ) ? 'true' : null;
			$aria_label  = empty( $product->in_stock ) ? __( 'Sold Out', 'surecart' ) : __( 'Add to Cart', 'surecart' );

			$this->set_attribute( '_root', 'disabled', $is_disabled );
			$this->set_attribute( '_root', 'aria-label', $aria_label );
			$this->set_attribute( '_root', 'data-wp-on--click', 'callbacks.handleSubmit' );
			$this->set_attribute( '_root', 'data-wp-on--keydown', 'callbacks.handleSubmit' );
		} else {
			$this->set_attribute(
				'_root',
				'data-wp-context',
				wp_json_encode(
					[
						'url' => sanitize_url( $quick_view_link ),
					],
					JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
				)
			);
			$this->set_attribute( '_root', 'aria-label', __( 'Quick Add Product', 'surecart' ) );
			$this->set_attribute( '_root', 'data-wp-on--click', 'actions.open' );
			$this->set_attribute( '_root', 'data-wp-on--keydown', 'actions.open' );
			$this->set_attribute( '_root', 'data-wp-on--mouseenter', 'actions.prefetch' );
			$this->set_attribute( '_root', 'data-wp-interactive', '{ "namespace": "surecart/product-quick-view" }' );
		}

		$this->set_attribute( '_root', 'class', 'wp-block-surecart-product-quick-view-button sc-button__link bricks-button' );
		$this->set_attribute( '_root', 'data-wp-class--loading', 'state.loading' );
		$this->set_attribute( '_root', 'data-wp-class--sc-button__link--busy', 'state.loading' );
		$this->set_attribute( '_root', 'aria-disabled', $is_disabled );

		if ( ! empty( $settings['size'] ) ) {
			$this->set_attribute( '_root', 'class', $settings['size'] );
		}

		if ( ! empty( $settings['style'] ) ) {
			// Outline (border).
			if ( isset( $settings['outline'] ) ) {
				$this->set_attribute( '_root', 'class', "bricks-color-{$settings['style']}" );
			} else { // Background (= default).
				$this->set_attribute( '_root', 'class', "bricks-background-{$settings['style']}" );
			}
		}

		if ( ! $this->is_admin_editor() ) {
			\SureCart::block()->quickView()->render();
		}

		?>
		<div 
			role="button" 
			tabindex="0" 
			<?php echo $this->render_attributes( '_root' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		>
			<span class="sc-spinner" aria-hidden="true"></span>
			<?php if ( $show_icon && 'before' === $attributes['icon_position'] ) : ?>
				<span class="sc-button__link-text"><?php echo self::render_icon( $settings['icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
			<?php endif; ?>
			<?php if ( $show_text ) : ?>
				<span class="sc-button__link-text"><?php echo esc_html( empty( $product->in_stock ) ? __( 'Sold Out', 'surecart' ) : $attributes['label'] ); ?></span>
			<?php endif; ?>
			<?php if ( $show_icon && 'after' === $attributes['icon_position'] ) : ?>
				<span class="sc-button__link-text"><?php echo self::render_icon( $settings['icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
			<?php endif; ?>
		</div>
		<?php
	}
}
