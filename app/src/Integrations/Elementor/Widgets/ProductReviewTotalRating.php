<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Total Rating widget.
 */
class ProductReviewTotalRating extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-total-rating';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Total Rating', 'surecart' );
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
		return array( 'surecart', 'product', 'total', 'rating', 'review', 'count' );
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
			'settings',
			[
				'label' => esc_html__( 'Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'show_for_zero_reviews',
			[
				'label'        => esc_html__( 'Show For Zero Reviews', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Display the block even when there are zero reviews.', 'surecart' ),
			]
		);

		$this->add_control(
			'show_label',
			[
				'label'        => esc_html__( 'Show Label', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show "review" or "reviews" label after the count.', 'surecart' ),
			]
		);

		$this->add_control(
			'style_variant',
			[
				'label'   => esc_html__( 'Style', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'default'   => esc_html__( 'Default', 'surecart' ),
					'plus-sign' => esc_html__( 'Plus Sign', 'surecart' ),
				],
				'default' => 'default',
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
		$this->start_controls_section(
			'settings_style',
			array(
				'label' => esc_html__( 'Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-total-rating' => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-total-rating',
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
		$settings              = $this->get_settings_for_display();
		$show_label            = 'yes' === ( $settings['show_label'] ?? 'yes' );
		$show_for_zero_reviews = 'yes' === ( $settings['show_for_zero_reviews'] ?? 'yes' );

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $show_label );
			return;
		}

		$attributes = [
			'show_label'            => $show_label,
			'show_for_zero_reviews' => $show_for_zero_reviews,
			'style_variant'         => $settings['style_variant'] ?? 'default',
		];
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-total-rating <?php echo wp_json_encode( $attributes ); ?> /-->
		</div>
		<?php
	}

	/**
	 * Render preview in editor.
	 *
	 * @param bool $show_label Show label flag.
	 *
	 * @return void
	 */
	private function render_preview( $show_label ) {
		$settings  = $this->get_settings_for_display();
		$is_plus   = 'plus-sign' === ( $settings['style_variant'] ?? 'default' );
		$plus_sign = $is_plus ? '+' : '';
		?>
		<div class="wp-block-surecart-product-review-total-rating">
			<span>42<?php echo esc_html( $plus_sign ); ?></span>
			<?php if ( $show_label ) : ?>
				<?php echo esc_html__( 'reviews', 'surecart' ); ?>
			<?php endif; ?>
		</div>
		<?php
	}
}
