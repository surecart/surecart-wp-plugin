<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Price widget.
 */
class SelectedPrice extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-selected-price';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Selected Price', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-price';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'price', 'selected', 'amount' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [ 'surecart-elementor' ];
	}

	/**
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array();
	}

	/**
	 * Add the selected price style controls.
	 *
	 * @return void
	 */
	private function add_collection_tags_style_controls() {
		//
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
				'label' => esc_html__( 'Selected Price', 'surecart' ),
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
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			//
		}

		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<div class="wp-block-group">
				<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"left","verticalAlignment":"bottom"}} -->
				<div class="wp-block-group"><!-- wp:surecart/product-selected-price-scratch-amount {"style":{"typography":{"textDecoration":"line-through","fontSize":"24px","lineHeight":"1.5"},"color":{"text":"#686868"},"elements":{"link":{"color":{"text":"#686868"}}}}} /-->

					<!-- wp:surecart/product-selected-price-amount {"style":{"typography":{"fontSize":"24px","lineHeight":"1.5"}}} /-->

					<!-- wp:surecart/product-selected-price-interval {"style":{"typography":{"lineHeight":"2"}}} /-->

					<!-- wp:surecart/product-sale-badge {"style":{"border":{"radius":"15px"},"typography":{"fontSize":"12px","lineHeight":"2.1"},"layout":{"selfStretch":"fit","flexSize":null},"elements":{"link":{"color":{"text":"var:preset|color|white"}}}},"textColor":"white"} /-->
				</div>
			</div>
		</div>
	<?php
	}
}
