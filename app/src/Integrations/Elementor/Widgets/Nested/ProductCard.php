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
		return [];
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
			$this->print_child( $index );
		}
		?>
		<!-- /wp:surecart/product-page -->

		<?php
		$item_content = ob_get_clean();
		?>
		<a href="<?php echo esc_url( get_permalink() ); ?>">
			<?php echo $item_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</a>
		<?php
	}
}
