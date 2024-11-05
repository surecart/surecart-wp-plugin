<?php

namespace SureCart\Integrations\Elementor\Widgets\Nested;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product List widget.
 */
class ProductList extends \Elementor\Modules\NestedElements\Base\Widget_Nested_Base {
	/**
	 * Get the widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-list';
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
		return esc_html__( 'Shop', 'elementor' );
	}

	/**
	 * Get the widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-products';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'product', 'surecart', 'shop', 'list' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor' );
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
		return array( 'surecart-elementor-product' );
	}

	/**
	 * Get the elementor product list loop template ID.
	 *
	 * @return int
	 */
	public function get_elementor_product_list_loop_item() {
		return get_option( 'surecart_elementor_product_list_loop_item' );
	}

	/**
	 * Create the elementor product list loop item.
	 *
	 * @return int
	 */
	public function create_and_get_elementor_product_list_loop_item() {
		// If option table template ID is set and has a post, return.
		if ( $this->get_elementor_product_list_loop_item() && get_post( $this->get_elementor_product_list_loop_item() ) ) {
			return (int) $this->get_elementor_product_list_loop_item();
		}

		// Query WP to get a handle on the template were going to copy
		$query = new \WP_Query([
			'post_type' => 'elementor_library',
			'name' => 'surecart_product_list_loop_item',
			'posts_per_page' => 1
		]);

		// No need to set up The Loop - we just want one post
		$template = $query->found_posts ? $query->posts[0] : false;

		// If the template doesn't exist, create it.
		if ( ! $template ) {
			$template_id = $this->create_product_list_loop_item();

			$template = get_post( $template_id );
		} else {
			$template_id = $template->ID;
		}

		// Save the template ID to the options table.
		update_option( 'surecart_elementor_product_list_loop_item', $template_id );

		return $template_id;
	}

	/**
	 * Create the product list loop item.
	 *
	 * @return int|\WP_Error
	 */
	private function create_product_list_loop_item()	 {
		// Create the template
		$post_id = wp_insert_post([
			'post_title' => __( 'SureCart Product List Loop Item', 'surecart' ),
			'post_name' => 'surecart_product_list_loop_item',
			'post_type' => 'elementor_library',
			'post_status' => 'publish',
		]);

		// Create the content
		$content = [
			[
				'id' => uniqid(),
				'elType' => 'container',
				'settings' => ['flex_direction' => 'column'],
				'elements' => [
					[
						'id' => uniqid(),
						'elType' => 'widget',
						'widgetType' => 'surecart-product',
						'settings' => [],
						'elements' => [
							[
								'id' => uniqid(),
								'elType' => 'container',
								'settings' => [
									'flex_direction' => 'column',
									'align_items' => 'center'
								],
								'elements' => [
									[
										'id' => uniqid(),
										'elType' => 'widget',
										'settings' => [
											'__dynamic__' => [
												'image' => '[elementor-tag id="" name="post-featured-image" settings="%7B%22fallback%22%3A%7B%22url%22%3A%22%22%2C%22id%22%3A%22%22%2C%22size%22%3A%22%22%7D%7D"]'
											],
										],
										'elements' => [],
										'widgetType' => 'theme-post-featured-image'
									],
									[
										'id' => uniqid(),
										'elType' => 'widget',
										'settings' => [
											'__dynamic__' => [
												'title' => '[elementor-tag id="" name="post-title" settings="%7B%22before%22%3A%22%22%2C%22after%22%3A%22%22%2C%22fallback%22%3A%22%22%7D"]'
											],
											'title' => 'Add Your Heading Text Here'
										],
										'elements' => [],
										'widgetType' => 'theme-post-title'
									],
									[
										'id' => uniqid(),
										'elType' => 'widget',
										'settings' => [
											'title' => 'Add Your Heading Text Here',
											'header_size' => 'h5',
											'__dynamic__' => [
												'title' => '[elementor-tag id="" name="sc_product_price" settings="%7B%7D"]'
											],
										],
										'elements' => [],
										'widgetType' => 'heading'
									],
									[
										'id' => uniqid(),
										'elType' => 'widget',
										'settings' => [
											'button_text' => 'Add To Cart',
											'button_out_of_stock_text' => 'Sold Out',
											'button_unavailable_text' => 'Unavailable'
										],
										'elements' => [],
										'widgetType' => 'surecart-buy-button'
									]
								],
								'isInner' => true
							]
						],
						'isInner' => true
					]
				],
				'isInner' => false
			]
		];

		// Update the post content
		update_post_meta( $post_id, '_elementor_data', wp_json_encode( $content ) );
		update_post_meta( $post_id, '_wp_page_template', 'elementor_canvas' );
		update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
		update_post_meta( $post_id, '_elementor_template_type', 'wp-page' );
		update_post_meta( $post_id, '_elementor_version', ELEMENTOR_VERSION ?? '' );
		update_post_meta( $post_id, '_elementor_pro_version', ELEMENTOR_PRO_VERSION ?? '' );
		update_post_meta( $post_id, '_elementor_css', '' );

		return $post_id;
	}

	/**
	 * Get the default children elements.
	 *
	 * @return array
	 */
	protected function get_default_children_elements() {
		$template_id = $this->create_and_get_elementor_product_list_loop_item();

		if ( ! $template_id ) {
			return [];
		}

		return [
			[
				'elType' => 'container',
				'settings' => [
					'flex_direction' => 'column',
					'content_width' => 'full',
				],
				'elements' => [
					[
						'elType' => 'widget',
						'widgetType' => 'loop-grid',
						'settings' => [
							'template_id' => $template_id,
							'pagination_page_limit' => 10,
							'pagination_prev_label' => __( 'Previous', 'surecart' ),
							'pagination_next_label' => __( 'Next', 'surecart' ),
							'text' => __( 'Load More', 'surecart' ),
							'load_more_no_posts_custom_message' => __( 'No more products to load.', 'surecart' ),
							'nothing_found_message_text' => __( 'It seems we can\'t find what you\'re looking for.', 'surecart' ),
							'post_query_post_type' => 'sc_product',
						],
						'elements' => [],
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
		return '.e-n-product-list';
	}

	/**
	 * Get the default children container placeholder selector.
	 *
	 * @return string
	 */
	protected function get_default_children_container_placeholder_selector() {
		return '.e-n-product-list';
	}

	/**
	 * Get the html wrapper class.
	 *
	 * @return string
	 */
	protected function get_html_wrapper_class() {
		return 'elementor-widget-n-product-list';
	}

	/**
	 * Render the widget.
	 *
	 * @return void
	 */
	protected function render() {
		ob_start();
		?>
		<?php $this->print_child( 0 ); ?>
		<?php
		$content = ob_get_clean();
		echo do_blocks( $content );
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
					'target_container'           => [ '.e-n-product-list' ],
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
		<div class="e-n-product-list">
		</div>
		<?php
	}
}
