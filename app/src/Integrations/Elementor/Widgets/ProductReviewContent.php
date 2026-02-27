<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review Content widget.
 *
 * This widget acts as a conditional visibility controller for its parent container.
 * Place this widget inside a section/container along with other review summary widgets.
 * When no reviews exist, the entire parent container will be hidden.
 */
class ProductReviewContent extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-content';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Review Content', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-eye';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'review', 'content', 'conditional', 'visibility', 'wrapper' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor-elements' );
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'section_info',
			[
				'label' => esc_html__( 'Info', 'surecart' ),
			]
		);

		$this->add_control(
			'info_notice',
			[
				'type'            => \Elementor\Controls_Manager::RAW_HTML,
				'raw'             => sprintf(
					'<div style="padding: 10px; border-radius: 3px;">
						<strong>%s</strong><br><br>%s
					</div>',
					esc_html__( 'Conditional Visibility Widget', 'surecart' ),
					esc_html__( 'Place this widget inside a container/section along with your review summary widgets (Average Rating, Stars, Breakdown, etc.). When no reviews exist for the product, the entire parent container will be hidden on the frontend.', 'surecart' )
				),
				'content_classes' => 'elementor-panel-alert',
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Check if the product has any published reviews.
	 *
	 * @return bool
	 */
	private function has_reviews() {
		$product = sc_get_product();

		if ( empty( $product ) ) {
			return false;
		}

		// Check if reviews are enabled for this product.
		if ( ! apply_filters( 'surecart/review_form/enabled', $product->reviews_enabled ) ) {
			return false;
		}

		// Check total reviews count from product.
		return ! empty( $product->total_reviews ) && (int) $product->total_reviews > 0;
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		// In editor mode, return early - always show the container.
		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			return;
		}

		// On frontend, if no reviews exist, hide the parent container.
		if ( ! $this->has_reviews() ) {
			$widget_id = $this->get_id();
			?>
			<div id="sc-review-content-<?php echo esc_attr( $widget_id ); ?>" data-sc-no-reviews="true" style="display: none;"></div>
			<script>
				(function() {
					var widget = document.getElementById('sc-review-content-<?php echo esc_js( $widget_id ); ?>');
					if (widget) {
						// Find the closest Elementor container/column/section parent
						var parent = widget.closest('.elementor-widget-container');
						if (parent) {
							parent = parent.closest('.elementor-column, .elementor-container, .e-con, .e-con-inner');
						}
						if (parent) {
							parent.style.display = 'none';
						}
					}
				})();
			</script>
			<?php
		}
		// If reviews exist, render nothing - the sibling widgets will render normally.
	}
}
