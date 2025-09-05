<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Line Item Note widget.
 */
class ProductLineItemNote extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-line-item-note';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Note', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-pencil';
	}

	/**
	 * Get style dependencies.
	 */
	public function get_style_depends() {
		return array( 'surecart-form-control' );
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'note', 'comment', 'message', 'product' );
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
	protected function register_content_settings() {
		$this->start_controls_section(
			'section_content',
			[
				'label' => esc_html__( 'Content', 'surecart' ),
			]
		);

		$this->add_control(
			'label',
			[
				'label'       => esc_html__( 'Label', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'placeholder' => esc_html__( 'Note', 'surecart' ),
				'default'     => 'Note',
			]
		);

		$this->add_control(
			'placeholder',
			[
				'label'       => esc_html__( 'Placeholder', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'placeholder' => esc_html__( 'Add a note (optional)', 'surecart' ),
				'default'     => esc_html__( 'Add a note (optional)', 'surecart' ),
			]
		);

		$this->add_control(
			'help_text',
			[
				'label'       => esc_html__( 'Help text', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'placeholder' => esc_html__( 'Enter help text (optional)', 'surecart' ),
				'description' => esc_html__( 'Optional text that appears below the note field to provide additional guidance.', 'surecart' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget label style settings.
	 *
	 * @return void
	 */
	protected function register_label_style_settings() {
		$note_selector = '{{WRAPPER}} .wp-block-surecart-product-line-item-note';

		$this->start_controls_section(
			'section_label_style',
			array(
				'label' => esc_html__( 'Label', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'label_text_color',
			array(
				'label'     => esc_html__( 'Text color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$note_selector                     => 'color: {{VALUE}}',
					$note_selector . ' .sc-form-label' => 'color: {{VALUE}}',
				],
				'default'   => '#000000',
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'           => 'label_typography',
				'label'          => esc_html__( 'Typography', 'surecart' ),
				'selector'       => $note_selector . ' label',
				'fields_options' => [
					'typography' => [ 'default' => 'yes' ],
					'font_size'  => [
						'default' => [
							'unit' => 'px',
							'size' => 16,
						],
					],
				],
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget textarea style settings.
	 *
	 * @return void
	 */
	protected function register_textarea_style_settings() {
		$textarea_selector = '{{WRAPPER}} .wp-block-surecart-product-line-item-note .sc-form-control';

		$this->start_controls_section(
			'section_textarea_style',
			array(
				'label' => esc_html__( 'Input field', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'           => 'textarea_typography',
				'label'          => esc_html__( 'Typography', 'surecart' ),
				'selector'       => $textarea_selector,
				'fields_options' => [
					'typography' => [ 'default' => 'yes' ],
					'font_size'  => [
						'default' => [
							'unit' => 'px',
							'size' => 14,
						],
					],
				],
			)
		);

		$this->add_responsive_control(
			'textarea_width',
			array(
				'label'      => esc_html__( 'Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					$textarea_selector => 'width: {{SIZE}}{{UNIT}};',
				),
				'default'    => [
					'size' => 100,
					'unit' => '%',
				],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 1000,
					],
					'em' => [
						'min'  => 0,
						'step' => 0.1,
						'max'  => 10,
					],
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'textarea_border',
				'selector' => $textarea_selector,
			]
		);

		$this->add_responsive_control(
			'textarea_border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					$textarea_selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'textarea_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					$textarea_selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget help text style settings.
	 *
	 * @return void
	 */
	protected function register_help_text_style_settings() {
		$help_text_selector = '{{WRAPPER}} .wp-block-surecart-product-line-item-note .sc-help-text';

		$this->start_controls_section(
			'section_help_text_style',
			array(
				'label' => esc_html__( 'Help Text', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'help_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$help_text_selector => 'color: {{VALUE}}',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'           => 'help_text_typography',
				'label'          => esc_html__( 'Typography', 'surecart' ),
				'selector'       => $help_text_selector,
				'fields_options' => [
					'typography' => [ 'default' => 'yes' ],
					'font_size'  => [
						'default' => [
							'unit' => 'px',
							'size' => 12,
						],
					],
				],
			)
		);

		$this->add_responsive_control(
			'help_text_margin',
			[
				'label'      => esc_html__( 'Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					$help_text_selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		$this->register_label_style_settings();
		$this->register_textarea_style_settings();
		$this->register_help_text_style_settings();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			?>
			<div class="wp-block-surecart-product-line-item-note">
				<?php if ( ! empty( $settings['label'] ) ) : ?>
					<label class="sc-form-label" for="sc_product_note">
						<?php echo esc_html( $settings['label'] ); ?>
					</label>
				<?php endif; ?>

				<textarea
					class="sc-form-control"
					name="sc_product_note"
					id="sc_product_note"
					placeholder="<?php echo esc_attr( $settings['placeholder'] ?? __( 'Add a note (optional)', 'surecart' ) ); ?>"
					rows="1"
					onfocus="this.rows=3"
					maxlength="485"
				></textarea>

				<?php if ( ! empty( $settings['help_text'] ) ) : ?>
					<div class="sc-help-text">
						<?php echo esc_html( $settings['help_text'] ); ?>
					</div>
				<?php endif; ?>
			</div>
			<?php
			return;
		}

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-line-item-note { "label" : "<?php echo esc_attr( $settings['label'] ?? '' ); ?>", "placeholder" : "<?php echo esc_attr( $settings['placeholder'] ?? '' ); ?>", "help_text" : "<?php echo esc_attr( $settings['help_text'] ?? '' ); ?>"} /-->
		</div>
		<?php
	}
}
