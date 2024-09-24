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
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-tag' );
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {

		// Collection Tags Style.
		$this->start_controls_section(
			'section_collection_tags_style',
			array(
				'label' => esc_html__( 'Collection Tags', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);
		// "spacing": {
		// "blockGap": {
		// "__experimentalDefault": "3px"
		// },
		// "margin": ["top", "bottom"],
		// "padding": ["horizontal", "vertical"]
		// },
		// "__experimentalBorder": {
		// "width": true,
		// "color": true,
		// "radius": true,
		// "__experimentalDefaultControls": {
		// "radius": true,
		// "color": true,
		// "width": true
		// }
		// }
		$this->add_control(
			'collection_tag_spacing',
			[
				'label'      => esc_html__( 'Spacing', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'.wp-block-surecart-product-collection-tags' => 'gap: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'.wp-block-surecart-product-collection-tags' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'collection_tag_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'.wp-block-surecart-product-collection-tags' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'collection_tag_border',
			[
				'label'      => esc_html__( 'Border', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'.wp-block-surecart-product-collection-tags' => 'border: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		// Collection Tag Style.
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
				'label'     => esc_html__( 'Text Color', 'elementor' ),
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
				'label'     => esc_html__( 'Background Color', 'elementor' ),
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
				'selector' => '.sc-collection-item',
			]
		);

		$this->add_control(
			'collection_tag_padding',
			[
				'label'      => esc_html__( 'Padding', 'elementor' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'.sc-collection-item' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'collection_tag_margin',
			[
				'label'      => esc_html__( 'Margin', 'elementor' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'.sc-collection-item' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-collection-tags -->
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
		<ul style="display: flex;gap: 3px;width: 100%;list-style: none;margin: 0;max-width: 100%;padding: 0;" class="wp-block-surecart-product-collection-tags">
			<li class="sc-collection-item">
				<a href="#" class="sc-tag sc-tag--default sc-tag--medium">Collection 1</a>
			</li>
			<li class="sc-collection-item">
				<a href="#" class="sc-tag sc-tag--default sc-tag--medium">Collection 2</a>
			</li>
			<li class="sc-collection-item">
				<a href="#" class="sc-tag sc-tag--default sc-tag--medium">Collection 3</a>
			</li>
		</ul>
		<?php
	}
}
