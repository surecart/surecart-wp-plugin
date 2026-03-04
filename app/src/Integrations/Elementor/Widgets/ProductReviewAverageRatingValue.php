<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Value widget.
 */
class ProductReviewAverageRatingValue extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-average-rating-value';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Average Rating Value', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-number-field';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'product', 'rating', 'value', 'review', 'number' );
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
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'section_settings',
			[
				'label' => esc_html__( 'Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'format_style',
			[
				'label'   => esc_html__( 'Format Style', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'none'        => esc_html__( 'None', 'surecart' ),
					'parentheses' => esc_html__( 'Parentheses', 'surecart' ),
					'slash'       => '/ 5.0',
				],
				'default' => 'none',
			]
		);

		$this->add_control(
			'link_to_reviews',
			[
				'label'        => esc_html__( 'Link to Reviews', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Yes', 'surecart' ),
				'label_off'    => esc_html__( 'No', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'no',
				'description'  => esc_html__( 'Link to the reviews section.', 'surecart' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	private function register_style_settings() {
		$selector = '{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value';
		$this->start_controls_section(
			'section_style',
			array(
				'label' => esc_html__( 'Text Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$selector        => 'color: {{VALUE}} !important;',
					$selector . ' a' => 'color: {{VALUE}} !important;',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'           => 'typography',
				'selector'       => $selector,
				'fields_options' => [
					'font_size'   => [
						'selectors' => [
							$selector => 'font-size: {{SIZE}}{{UNIT}} !important;',
						],
					],
					'font_weight' => [
						'selectors' => [
							$selector => 'font-weight: {{VALUE}} !important;',
						],
					],
					'line_height' => [
						'selectors' => [
							$selector => 'line-height: {{SIZE}}{{UNIT}} !important;',
						],
					],
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->register_content_settings();
		$this->register_style_settings();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings        = $this->get_settings_for_display();
		$format_style    = $settings['format_style'] ?? 'none';
		$class_name      = 'none' === $format_style ? '' : 'is-style-' . $format_style;
		$link_to_reviews = 'yes' === ( $settings['link_to_reviews'] ?? 'yes' );

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $class_name, $link_to_reviews );
			return;
		}

		$attributes = [
			'className'       => $class_name,
			'link_to_reviews' => $link_to_reviews,
		];
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-average-rating-value <?php echo wp_json_encode( $attributes ); ?> /-->
		</div>
		<?php
	}

	/**
	 * Render preview in editor.
	 *
	 * @param string $class_name      Class name for styling.
	 * @param bool   $link_to_reviews Link to reviews flag.
	 *
	 * We need to add the styles manually, because if on demand block assets load settings are enabled,
	 * then those styles won't be loaded and that's mandatory for editor preview.
	 *
	 * @return void
	 */
	public function render_preview( $class_name, $link_to_reviews = true ): void {
		$product = sc_get_product();
		$content = ! empty( $product->average_stars ) ? (string) $product->average_stars : '4.5';

		if ( strpos( $class_name, 'is-style-parentheses' ) !== false ) {
			$content = '(' . $content . ')';
		} elseif ( strpos( $class_name, 'is-style-slash' ) !== false ) {
			$content = $content . ' / 5.0';
		}

		$reviews_url = sc_get_product_review_link();
		?>
		<div class="wp-block-surecart-product-review-average-rating-value">
			<span class="<?php echo esc_attr( trim( $class_name ) ); ?>">
				<?php if ( $link_to_reviews ) : ?>
					<a href="<?php echo $reviews_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>" class="sc-review-link"><?php echo esc_html( $content ); ?></a>
				<?php else : ?>
					<?php echo esc_html( $content ); ?>
				<?php endif; ?>
			</span>
		</div>
		<?php
	}
}
