<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Buy Button widget.
 */
class BuyButton extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-buy-button';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Buy Button', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-cart';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'buy', 'button' );
	}

	/**
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'section_content',
			[
				'label' => esc_html__( 'Content Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'buy_button_type',
			[
				'label'       => esc_html__( 'Go Directly To Checkout', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SWITCHER,
				'label_on'    => esc_html__( 'Yes', 'surecart' ),
				'label_off'   => esc_html__( 'No', 'surecart' ),
				'default'     => 'no',
				'description' => esc_html__( 'Bypass adding to cart and go directly to the checkout.', 'surecart' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_text_settings',
			[
				'label' => esc_html__( 'Text Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'button_text',
			[
				'label'   => esc_html__( 'Button Text', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Add To Cart', 'surecart' ),
			]
		);

		$this->add_control(
			'button_out_of_stock_text',
			[
				'label'   => esc_html__( 'Out of stock label', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Sold Out', 'surecart' ),
			]
		);

		$this->add_control(
			'button_unavailable_text',
			[
				'label'   => esc_html__( 'Unavailable label', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Unavailable', 'surecart' ),
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
			'section_style',
			[
				'label' => esc_html__( 'Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'button_typography',
				'global'   => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_PRIMARY,
				],
				'selector' => '{{WRAPPER}} .sc-button',
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
		$settings      = $this->get_settings_for_display();
		$is_buy_button = 'yes' === $settings['buy_button_type'];

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			?>
			<div>
				<button
					class="wp-block-button__link wp-element-button sc-button__link"
					data-wp-bind--disabled="state.isUnavailable"
					data-wp-class--sc-button__link--busy="context.busy"
				>
					<span class="sc-button__link-text" data-wp-text="state.buttonText">
						<?php echo esc_html( $settings['button_text'] ); ?>
					</span>
				</button>
			</div>
			<?php
			return;
		}

		$attributes = array(
			'add_to_cart'       => ! $is_buy_button,
			'text'              => esc_attr( $settings['button_text'] ),
			'out_of_stock_text' => esc_attr( $settings['button_out_of_stock_text'] ),
			'unavailable_text'  => esc_attr( $settings['button_unavailable_text'] ),
		);

		echo do_blocks( '<!-- wp:surecart/buy-button ' . wp_json_encode( $attributes ) . '  /-->' );
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div>
			<button
				class="wp-block-button__link wp-element-button sc-button__link"
			>
				<span class="sc-button__link-text" data-wp-text="state.buttonText">
					{{{ settings.button_text }}}
				</span>
			</button>
		</div>
		<?php
	}
}
