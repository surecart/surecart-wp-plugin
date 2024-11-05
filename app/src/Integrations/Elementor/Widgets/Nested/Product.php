<?php

namespace SureCart\Integrations\Elementor\Widgets\Nested;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product widget.
 */
class Product extends \Elementor\Modules\NestedElements\Base\Widget_Nested_Base {
	/**
	 * Get the widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product';
	}

	/**
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-elementor-container-style' );
	}

	/**
	 * Get the widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product', 'elementor' );
	}

	/**
	 * Get the widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-pages';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return [ 'product', 'surecart' ];
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
	 * Show the widget in the panel.
	 *
	 * @return bool
	 */
	public function show_in_panel(): bool {
		return \Elementor\Plugin::$instance->experiments->is_feature_active( 'nested-elements' );
	}

	/**
	 * Get the widget script dependencies.
	 *
	 * @return array
	 */
	public function get_script_depends() {
		return [ 'surecart-elementor-product' ];
	}

	/**
	 * Get the default children elements.
	 *
	 * @return array
	 */
	protected function get_default_children_elements() {
		return [
			[
				'elType' => 'container',
				'settings' => [
					'flex_direction' => 'row',
					'flex_gap' => [
						'unit' => 'px',
						'size' => 0,
						'column' => '0',
						'row' => '0',
					],
				],
				'elements' => [
					[
						'elType' => 'container',
						'settings' => [
							'flex_direction' => 'column',
							'content_width' => 'full',
							'width' => [
								'unit' => '%',
								'size' => '50',
							],
						],
						'elements' => [
							[
								'elType' => 'widget',
								'settings' => [
									'content_width' => 'full',
								],
								'elements' => [],
								'widgetType' => 'surecart-media',
							],
						],
						'isInner' => true,
					],
					[
						'elType' => 'container',
						'settings' => [
							'flex_direction' => 'column',
							'content_width' => 'full',
							'width' => [
								'unit' => '%',
								'size' => '50',
							],
						],
						'elements' => [
							[
								'elType' => 'widget',
								'elements' => [],
								'settings' => [
									'content_width' => 'full',
								],
								'widgetType' => 'surecart-collection-tags',
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'settings' => [
									'content_width' => 'full',
								],
								'widgetType' => 'theme-post-title',
							],
							[
								'elType' => 'widget',
								'settings' => [
									'__dynamic__' => [
										'excerpt' => '[elementor-tag id="" name="post-excerpt" settings="%7B%22max_length%22%3A%22%22%2C%22apply_to_post_content%22%3A%22yes%22%2C%22before%22%3A%22%22%2C%22after%22%3A%22%22%2C%22fallback%22%3A%22%22%7D"]',
									],
								],
								'elements' => [],
								'widgetType' => 'theme-post-excerpt',
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'settings' => [
									'content_width' => 'full',
								],
								'widgetType' => 'surecart-selected-price',
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'widgetType' => 'surecart-price-chooser',
								'settings' => [
									'content_width' => 'full',
									'label' => esc_html__('Pricing', 'surecart'),
									'price_chooser_flex_direction' => 'column',
									'price_chooser_flex_gap' => [
										'column' => '12',
										'row' => '12',
										'isLinked' => true,
										'unit' => 'px',
										'size' => 12,
									],
									'price_chooser_columns_grid' => [
										'unit' => 'fr',
										'size' => 1,
										'sizes' => [],
									],
									'price_chooser_flex_wrap' => 'wrap',
								],
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'widgetType' => 'surecart-selected-price-ad-hoc-amount',
								'settings' => [
									'content_width' => 'full',
									'label' => esc_html__('Enter an amount', 'surecart'),
								],
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'widgetType' => 'surecart-variant-pills',
								'settings' => [
									'content_width' => 'full',
								],
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'widgetType' => 'surecart-quantity',
								'settings' => [
									'content_width' => 'full',
									'label' => esc_html__('Quantity', 'surecart'),
								],
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'widgetType' => 'surecart-buy-button',
								'settings' => [
									'content_width' => 'full',
									'width' => [
										'unit' => '%',
										'size' => '100',
									],
									'button_text' => esc_html__('Add To Cart', 'surecart'),
								],
							],
							[
								'elType' => 'widget',
								'elements' => [],
								'widgetType' => 'surecart-buy-button',
								'settings' => [
									'content_width' => 'full',
									'buy_button_type' => 'yes',
									'width' => [
										'unit' => '%',
										'size' => '100',
									],
									'button_text' => esc_html__('Buy Now', 'surecart'),
								],
							],
						],
						'isInner' => true,
					],
				],
				'isInner' => false,
			],
		];
	}

	/**
	 * Get the default repeater title setting key.
	 *
	 * @return string
	 */
	protected function get_default_repeater_title_setting_key() {
		return 'item_title';
	}

	/**
	 * Get the default children title.
	 *
	 * @return string
	 */
	protected function get_default_children_title() {
		return esc_html__( 'Container', 'surecart' );
	}

	/**
	 * Get the default children placeholder selector.
	 *
	 * @return string
	 */
	protected function get_default_children_placeholder_selector() {
		return '.e-n-product';
	}

	/**
	 * Get the default children container placeholder selector.
	 *
	 * @return string
	 */
	protected function get_default_children_container_placeholder_selector() {
		return '.e-n-product-item';
	}

	/**
	 * Get the html wrapper class.
	 *
	 * @return string
	 */
	protected function get_html_wrapper_class() {
		return 'elementor-widget-n-product';
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'section_product',
			[
				'label' => esc_html__( 'Product', 'elementor' ),
			]
		);

		$this->add_control(
			'link_to_product',
			[
				'label'        => esc_html__( 'Link to product', 'elementor' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'default'      => 'no',
				'return_value' => 'yes',
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render the widget.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		// items content.
		ob_start();
		?>
		<!-- wp:surecart/product-page -->
		<?php $this->print_child( 0 ); ?>
		<!-- /wp:surecart/product-page -->
		<?php
		$item_content = ob_get_clean();

		if ( 'yes' === $settings['link_to_product'] ) {
			$item_content = sprintf( '<a href="%s">%s</a>', get_permalink(), $item_content );
		}

		echo do_blocks( $item_content );
	}

	/**
	 * Print the child.
	 *
	 * @param int    $index The index of the child.
	 * @param string $item_id The id of the item.
	 * @return void
	 */
	public function print_child( $index, $item_id = null ) {
		$children = $this->get_children();

		if ( ! empty( $children[ $index ] ) ) {
			// Add data-tab-index attribute to the content area.
			$add_attribute_to_container = function ( $should_render, $container ) use ( $item_id ) {
				$this->add_attributes_to_container( $container, $item_id );

				return $should_render;
			};

			add_filter( 'elementor/frontend/container/should_render', $add_attribute_to_container, 10, 3 );
			$children[ $index ]->print_element();
			remove_filter( 'elementor/frontend/container/should_render', $add_attribute_to_container );
		}
	}

	/**
	 * Add attributes to the container.
	 *
	 * @param object $container The container object.
	 * @param string $item_id The id of the item.
	 * @return void
	 */
	protected function add_attributes_to_container( $container, $item_id ) {
		$container->add_render_attribute(
			'_wrapper',
			[
				'role'            => 'region',
				'aria-labelledby' => $item_id,
			]
		);
	}

	/**
	 * Get the initial config.
	 *
	 * @return array
	 */
	protected function get_initial_config(): array {
		if ( \Elementor\Plugin::$instance->experiments->is_feature_active( 'e_nested_atomic_repeaters' ) ) {
			return array_merge(
				parent::get_initial_config(),
				[
					'support_improved_repeaters' => true,
					'target_container'           => [ '.e-n-product' ],
					'node'                       => 'details',
					'is_interlaced'              => true,
				]
			);
		}

		return parent::get_initial_config();
	}

	/**
	 * Render the content template for a single repeater item.
	 *
	 * @return void
	 */
	protected function content_template_single_repeater_item() {
		?>
		<details {{{ view.getRenderAttributeString( 'details-container' ) }}}>
		</details>
		<?php
	}

	/**
	 * Render the content template.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="e-n-product">
		</div>
		<?php
	}
}
