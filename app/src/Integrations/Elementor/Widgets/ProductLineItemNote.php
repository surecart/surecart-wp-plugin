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
		return esc_html__( 'Product Line Item Note', 'surecart' );
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
			'noOfRows',
			[
				'label'   => esc_html__( 'Number of Rows', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::NUMBER,
				'min'     => 1,
				'max'     => 10,
				'step'    => 1,
				'default' => 2,
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
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$note_selector                     => 'color: {{VALUE}}',
					$note_selector . ' .sc-form-label' => 'color: {{VALUE}}',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'label_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $note_selector . ' label',
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
				'label' => esc_html__( 'Textarea', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'textarea_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $textarea_selector,
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
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->register_content_settings();
		$this->register_label_style_settings();
		$this->register_textarea_style_settings();
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
					rows="<?php echo esc_attr( $settings['noOfRows'] ?? 2 ); ?>"
					maxlength="500"
				></textarea>
			</div>
			<?php
			return;
		}

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-line-item-note { "label" : "<?php echo esc_attr( $settings['label'] ?? '' ); ?>", "placeholder" : "<?php echo esc_attr( $settings['placeholder'] ?? '' ); ?>", "noOfRows" : <?php echo esc_attr( $settings['noOfRows'] ?? 2 ); ?>} /-->
		</div>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="wp-block-surecart-product-line-item-note">
			<# if ( settings.label ) { #>
				<label for="sc_product_note" class="sc-form-label">
					{{{ settings.label }}}
				</label>
			<# } #>

			<textarea
				class="sc-form-control"
				name="sc_product_note"
				id="sc_product_note"
				placeholder="{{{ settings.placeholder || '<?php echo esc_js( __( 'Add a note (optional)', 'surecart' ) ); ?>' }}}"
				rows="{{{ settings.noOfRows || 2 }}}"
				maxlength="500"
			></textarea>
		</div>
		<?php
	}
}
