<?php

namespace SureCart\Integrations\Elementor\Widgets;

use ElementorPro\Modules\Posts\Skins\Skin_Content_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Content widget.
 */
class ProductContent extends \Elementor\Widget_Base {
	use Skin_Content_Base;

	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-content';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Content', 'surecart' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor-elements' );
	}

	protected function register_controls() {
		$this->start_controls_section(
			'section_style',
			[
				'label' => esc_html__( 'Style', 'elementor-pro' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_responsive_control(
			'align',
			[
				'label'     => esc_html__( 'Alignment', 'elementor-pro' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => [
					'left'    => [
						'title' => esc_html__( 'Left', 'elementor-pro' ),
						'icon'  => 'eicon-text-align-left',
					],
					'center'  => [
						'title' => esc_html__( 'Center', 'elementor-pro' ),
						'icon'  => 'eicon-text-align-center',
					],
					'right'   => [
						'title' => esc_html__( 'Right', 'elementor-pro' ),
						'icon'  => 'eicon-text-align-right',
					],
					'justify' => [
						'title' => esc_html__( 'Justified', 'elementor-pro' ),
						'icon'  => 'eicon-text-align-justify',
					],
				],
				'selectors' => [
					'{{WRAPPER}}' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'text_color',
			[
				'label'     => esc_html__( 'Text Color', 'elementor-pro' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}}' => 'color: {{VALUE}};',
				],
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_TEXT,
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'   => 'typography',
				'global' => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_TEXT,
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render the widget content.
	 *
	 * This method is called to output the content of the widget.
	 * In editor mode, it displays a placeholder message.
	 *
	 * @return void
	 */
	protected function render() {
		$product = sc_get_product();

		if ( empty( $product ) || ( empty( get_the_content() ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) ) {
			?>
			<div>
				<p><?php esc_html_e( 'This section will display the content you create using the Content Designer on the Edit Product page.', 'surecart' ); ?></p>
				<p><?php esc_html_e( 'Use this area to add detailed information about your product, such as features, specifications, and usage instructions.', 'surecart' ); ?></p>
				<p><?php esc_html_e( 'In the template preview, you can see how the product\'s content will appear to customers.', 'surecart' ); ?></p>
				<p><?php esc_html_e( 'Note: If you haven\'t added any content in the Content Designer, this area will remain empty. This text is for demonstration purposes only.', 'surecart' ); ?></p>
			</div>
			<?php

			return;
		}

		$this->render_post_content( false, false );
	}
}
