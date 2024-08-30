<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


/**
 * Selected Price Ad Hoc Amount widget.
 */
class SelectedPriceAdHocAmount extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-selected-price-ad-hoc-amount';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Custom Amount', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-plus';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'custom', 'amount' );
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'section_quantity',
			[
				'label' => esc_html__( 'Custom Amount', 'elementor' ),
			]
		);

		$this->add_control(
			'label',
			[
				'label'       => esc_html__( 'Label', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'placeholder' => esc_html__( 'Enter an amount', 'surecart' ),
				'default'     => esc_html__( 'Enter an amount', 'surecart' ),
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
		$settings = $this->get_settings_for_display();

		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-selected-price-ad-hoc-amount { "label" : "<?php echo esc_attr( $settings['label'] ); ?>"} /-->
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
		<div>
			<label for="" class="sc-form-label">Custom amount</label>
			<div className="sc-input-group">
				<span class="sc-input-group-text" id="basic-addon1">
					$
				</span>
				<input
					class="sc-form-control"
					type="number"
					step="0.01"
					onwheel="this.blur()"
				/>
			</div>
		</div>
		<?php
	}
}
