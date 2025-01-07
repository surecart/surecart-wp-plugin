<?php

namespace SureCart\Integrations\Elementor\Widgets\Nested;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Card widget.
 */
class ProductCard extends Product {
	/**
	 * Get the widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-card';
	}

	/**
	 * Get the widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Card', 'surecart' );
	}

	/**
	 * Get the widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-info-box';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return [ 'product', 'card', 'surecart' ];
	}

	/**
	 * Get the default children title.
	 *
	 * @return string
	 */
	protected function get_default_children_title() {
		return esc_html__( 'Product Card', 'surecart' );
	}

	/**
	 * Get the widget script dependencies.
	 *
	 * @return array
	 */
	public function get_script_depends() {
		return [ 'surecart-elementor-product-loop' ];
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [ 'surecart-elementor-product-loop' ];
	}

	/**
	 * Get the default children elements.
	 *
	 * @return array
	 */
	protected function get_default_children_elements() {
		return [
			[
				'id'       => uniqid(),
				'elType'   => 'container',
				'settings' => [ 'flex_direction' => 'column' ],
				'elements' => [
					[
						'id'         => uniqid(),
						'elType'     => 'widget',
						'settings'   => [
							'__dynamic__' => [
								'image' => '[elementor-tag id="" name="post-featured-image" settings="%7B%22before%22%3A%22%22%2C%22after%22%3A%22%22%2C%22fallback%22%3A%22%22%7D"]',
							],
							'space'       => [
								'unit'  => '%',
								'size'  => 100,
								'sizes' => [],
							],
							'align'       => 'center',
							'height'      => [
								'unit'  => 'px',
								'size'  => 300,
								'sizes' => [],
							],
							'object-fit'  => 'contain',
						],
						'elements'   => [],
						'widgetType' => 'theme-post-featured-image',
					],
					[
						'id'         => uniqid(),
						'elType'     => 'widget',
						'settings'   => [
							'__dynamic__'            => [
								'title' => '[elementor-tag id="" name="post-title" settings="%7B%22before%22%3A%22%22%2C%22after%22%3A%22%22%2C%22fallback%22%3A%22%22%7D"]',
							],
							'title'                  => esc_html__( 'Add Your Heading Text Here', 'surecart' ),
							'header_size'            => 'h2',
							'typography_typography'  => 'custom',
							'typography_font_size'   => [
								'unit'  => 'px',
								'size'  => 15,
								'sizes' => [],
							],
							'typography_font_weight' => '600',
						],
						'elements'   => [],
						'widgetType' => 'theme-post-title',
					],
					[
						'id'         => uniqid(),
						'elType'     => 'widget',
						'settings'   => [
							'scratch_typography_typography' => 'custom',
							'scratch_typography_font_size' => [
								'unit'  => 'px',
								'size'  => 15,
								'sizes' => [],
							],
							'amount_typography_typography' => 'custom',
							'amount_typography_font_size'  => [
								'unit'  => 'px',
								'size'  => 18,
								'sizes' => [],
							],
							'amount_typography_font_weight' => 'bold',
							'interval_typography_typography' => 'custom',
							'interval_typography_font_size' => [
								'unit'  => 'px',
								'size'  => 12,
								'sizes' => [],
							],
							'badge_text_color'             => '#FFFFFF',
							'badge_background_color'       => '#191818',
							'badge_border_border'          => 'solid',
							'badge_border_width'           => [
								'unit'     => 'px',
								'top'      => '1',
								'right'    => '1',
								'bottom'   => '1',
								'left'     => '1',
								'isLinked' => true,
							],
							'badge_border_radius'          => [
								'unit'     => 'px',
								'top'      => '14',
								'right'    => '14',
								'bottom'   => '14',
								'left'     => '14',
								'isLinked' => true,
							],
							'badge_padding'                => [
								'unit'     => 'px',
								'top'      => '6',
								'right'    => '10',
								'bottom'   => '6',
								'left'     => '10',
								'isLinked' => false,
							],
						],
						'elements'   => [],
						'widgetType' => 'surecart-selected-price',
					],
					[
						'id'         => uniqid(),
						'elType'     => 'widget',
						'settings'   => [
							'button_text'              => esc_html__( 'Add To Cart', 'surecart' ),
							'button_out_of_stock_text' => esc_html__( 'Sold Out', 'surecart' ),
							'button_unavailable_text'  => esc_html__( 'Unavailable', 'surecart' ),
						],
						'elements'   => [],
						'widgetType' => 'surecart-add-to-cart-button',
					],
				],
				'isInner'  => false,
			],
		];
	}

	/**
	 * Render the widget.
	 *
	 * @return void
	 */
	protected function render() {
		// items content.
		ob_start();
		?>

		<!-- wp:surecart/product-page -->
		<?php
		$children = $this->get_children();
		foreach ( $children as $index => $child ) {
			$this->print_child($index );
		}
		?>
		<!-- /wp:surecart/product-page -->

		<?php
		$item_content = ob_get_clean();
		?>
		<a href="<?php echo esc_url( get_permalink() ); ?>">
			<?php echo do_blocks( $item_content ); ?>
		</a>
		<?php
	}
}
