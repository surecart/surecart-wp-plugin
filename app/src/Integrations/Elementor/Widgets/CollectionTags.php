<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Collection Tags widget.
 */
class CollectionTags extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-collection-tags';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Collection Tags', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-tags';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'collection', 'tags' );
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
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-tag' );
	}

	/**
	 * Add the collection tags style controls.
	 *
	 * @return void
	 */
	private function add_collection_tags_style_controls() {
		$this->start_controls_section(
			'section_collection_tags_style',
			array(
				'label' => esc_html__( 'Collection Tags', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'collection_tags_direction',
			array(
				'label'     => esc_html__( 'Direction', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => array(
					'row'            => array(
						'title' => esc_html__( 'Row', 'surecart' ),
						'icon'  => 'eicon-arrow-right',
					),
					'column'         => array(
						'title' => esc_html__( 'Column', 'surecart' ),
						'icon'  => 'eicon-arrow-down',
					),
					'row-reverse'    => array(
						'title' => esc_html__( 'Row Reverse', 'surecart' ),
						'icon'  => 'eicon-arrow-left',
					),
					'column-reverse' => array(
						'title' => esc_html__( 'Column Reverse', 'surecart' ),
						'icon'  => 'eicon-arrow-up',
					),
				),
				'default'   => 'row',
				'selectors' => [
					'.wp-block-surecart-product-collection-tags' => 'flex-direction: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'collection_tags_justify',
			array(
				'label'     => esc_html__( 'Justify', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => array(
					'flex-start'    => array(
						'title' => esc_html__( 'Start', 'surecart' ),
						'icon'  => 'eicon-flex eicon-justify-start-h',
					),
					'center'        => array(
						'title' => esc_html__( 'Center', 'surecart' ),
						'icon'  => 'eicon-flex eicon-justify-center-h',
					),
					'flex-end'      => array(
						'title' => esc_html__( 'End', 'surecart' ),
						'icon'  => 'eicon-flex eicon-justify-end-h',
					),
					'space-between' => array(
						'title' => esc_html__( 'Space Between', 'surecart' ),
						'icon'  => 'eicon-flex eicon-justify-space-between-h',
					),
					'space-around'  => array(
						'title' => esc_html__( 'Space Around', 'surecart' ),
						'icon'  => 'eicon-flex eicon-justify-space-around-h',
					),
					'space-evenly'  => array(
						'title' => esc_html__( 'Space Evenly', 'surecart' ),
						'icon'  => 'eicon-flex eicon-justify-space-evenly-h',
					),
				),
				'default'   => 'flex-start',
				'selectors' => [
					'.wp-block-surecart-product-collection-tags' => 'justify-content: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'collection_tags_align',
			array(
				'label'     => esc_html__( 'Align', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => array(
					'flex-start' => array(
						'title' => esc_html__( 'Start', 'surecart' ),
						'icon'  => 'eicon-flex eicon-align-start-v',
					),
					'center'     => array(
						'title' => esc_html__( 'Center', 'surecart' ),
						'icon'  => 'eicon-flex eicon-align-center-v',
					),
					'flex-end'   => array(
						'title' => esc_html__( 'End', 'surecart' ),
						'icon'  => 'eicon-flex eicon-align-end-v',
					),
					'stretch'    => array(
						'title' => esc_html__( 'Stretch', 'surecart' ),
						'icon'  => 'eicon-flex eicon-align-stretch-v',
					),
				),
				'default'   => 'flex-start',
				'selectors' => [
					'.wp-block-surecart-product-collection-tags' => 'align-items: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'collection_tags_gap',
			array(
				'label'      => esc_html__( 'Gap', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'range'      => [
					'px' => array(
						'min' => 0,
						'max' => 1000,
					),
					'em' => array(
						'min'  => 0,
						'step' => 0.1,
						'max'  => 10,
					),
				],
				'default'    => array(
					'size' => 3,
					'unit' => 'px',
				),
				'selectors'  => array(
					'.wp-block-surecart-product-collection-tags' => 'gap: {{SIZE}}{{UNIT}} !important;',
				),
			)
		);

		$this->add_control(
			'collection_tags_wrap',
			array(
				'label'     => esc_html__( 'Wrap', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => array(
					'nowrap' => array(
						'title' => esc_html__( 'No Wrap', 'surecart' ),
						'icon'  => 'eicon-flex eicon-nowrap',
					),
					'wrap'   => array(
						'title' => esc_html__( 'Wrap', 'surecart' ),
						'icon'  => 'eicon-flex eicon-wrap',
					),
				),
				'default'   => 'nowrap',
				'selectors' => [
					'.wp-block-surecart-product-collection-tags' => 'flex-wrap: {{VALUE}};',
				],
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Add the collection tag style controls.
	 *
	 * @return void
	 */
	private function add_collection_tag_style_controls() {
		$this->start_controls_section(
			'section_collection_tag_style',
			array(
				'label' => esc_html__( 'Collection Tag', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'collection_tag_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					'.sc-collection-item .sc-tag' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'collection_tag_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'.sc-collection-item .sc-tag' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography_number',
				'global'   => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_PRIMARY,
				],
				'selector' => '.sc-collection-item .sc-tag',
			]
		);

		$this->add_control(
			'collection_tag_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'.sc-collection-item .sc-tag' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'collection_tag_margin',
			[
				'label'      => esc_html__( 'Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'.sc-collection-item .sc-tag' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'      => 'collection_tag_border',
				'selector'  => '{{WRAPPER}} .sc-collection-item .sc-tag',
				'separator' => 'before',
			]
		);

		$this->add_responsive_control(
			'collection_tag_border_radius',
			array(
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => array(
					'.sc-collection-item .sc-tag' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Add content controls.
	 *
	 * @return void
	 */
	protected function add_content_controls() {
		$this->start_controls_section(
			'section_content',
			array(
				'label' => esc_html__( 'Content', 'surecart' ),
			)
		);

		// add the count setting.
		$this->add_control(
			'count',
			array(
				'label'       => esc_html__( 'Count', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::NUMBER,
				'description' => esc_html__( 'Number of tags to display.', 'surecart' ),
				'default'     => 1,
				'min'         => 1,
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->add_content_controls();
		$this->add_collection_tags_style_controls();
		$this->add_collection_tag_style_controls();
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
				<ul style="display: flex;width: 100%;list-style: none;margin: 0;max-width: 100%;padding: 0;" class="wp-block-surecart-product-collection-tags">
					<?php for ( $i = 0; $i < $settings['count']; $i++ ) : ?>
						<li class="sc-collection-item">
							<a href="#" class="sc-tag sc-tag--default sc-tag--medium">Collection <?php echo esc_html( $i + 1 ); ?></a>
						</li>
					<?php endfor; ?>
				</ul>
			<?php
			return;
		}

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-collection-tags {"count" : <?php echo esc_attr( $settings['count'] ?? 1 ); ?> } -->
				<!-- wp:surecart/product-collection-tag /-->
			<!-- /wp:surecart/product-collection-tags -->
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
		<ul style="display: flex;width: 100%;list-style: none;margin: 0;max-width: 100%;padding: 0;" class="wp-block-surecart-product-collection-tags">
			<# for ( var i = 0; i < settings.count; i++ ) { #>
				<li class="sc-collection-item">
					<a href="#" class="sc-tag sc-tag--default sc-tag--medium">Collection {{ i + 1 }}</a>
				</li>
			<# } #>
		</ul>
		<?php
	}
}
