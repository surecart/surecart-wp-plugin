<?php

namespace SureCart\Integrations\Bricks\Elements;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class ProductContent.
 */
class ProductContent extends \Bricks\Element {
	/**
	 * The name of the element.
	 *
	 * @var string
	 */
	public $name = 'product-content';

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Elements';

	/**
	 * The icon for the element.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-list-box';

	/**
	 * Enqueue scripts and styles for the element.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_style( 'wp-block-library' );
		wp_enqueue_style( 'global-styles' );
	}

	/**
	 * Get the label for the element.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Content', 'surecart' );
	}

	/**
	 * Set the controls for the element.
	 *
	 * @return void
	 */
	public function set_controls() {
		$post_id = get_the_ID();

		$template_preview_post_id = \Bricks\Helpers::get_template_setting( 'templatePreviewPostId', $post_id );

		if ( $template_preview_post_id ) {
			$post_id = $template_preview_post_id;
		}

		$edit_link = get_edit_post_link( $post_id );

		$this->controls['info'] = [
			'tab'      => 'content',
			'type'     => 'info',
			'content'  => "<a href=\"$edit_link\" target=\"_blank\">" . esc_html__( 'Edit WordPress content (WP admin).', 'surecart' ) . '</a>',
			'required' => [ 'dataSource', '!=', 'bricks' ],
		];

		if ( BRICKS_DB_TEMPLATE_SLUG === get_post_type() ) {
			$this->controls['dataSource'] = [
				'tab'         => 'content',
				'label'       => esc_html__( 'Data source', 'surecart' ),
				'type'        => 'select',
				'options'     => [
					'editor' => __( 'WordPress', 'surecart' ),
					'bricks' => __( 'Bricks', 'surecart' ),
				],
				'inline'      => true,
				'placeholder' => __( 'WordPress', 'surecart' ),
			];
		}
	}

	/**
	 * Render the element.
	 *
	 * @return void
	 */
	public function render() {
		$settings    = $this->settings;
		$data_source = $settings['dataSource'] ?? '';

		// To apply CSS flex when "Data Source" is set to "bricks".
		if ( $data_source ) {
			$this->set_attribute( '_root', 'data-source', $data_source );
		}

		$output = '';

		// STEP: Render Bricks data.
		if ( 'bricks' === $data_source ) {
			// Previewing a template.
			if ( \Bricks\Helpers::is_bricks_template( $this->post_id ) ) {
				return $this->render_element_placeholder(
					[
						'title'       => esc_html__( 'For better preview select content to show.', 'surecart' ),
						'description' => esc_html__( 'Go to: Settings > Template Settings > Populate Content', 'surecart' ),
					]
				);
			}

			// Get Bricks data.
			$bricks_data = get_post_meta( $this->post_id, BRICKS_DB_PAGE_CONTENT, true );

			if ( empty( $bricks_data ) || ! is_array( $bricks_data ) ) {
				$placeholder_data = [
					'title' => esc_html__( 'No Bricks data found.', 'surecart' ),
				];

				// Add custom class if source is Bricks (for StaticArea.vue to find the placeholder) (@since 1.12.2).
				if ( 'bricks' === $data_source ) {
					$placeholder_data['class'] = 'brx-post-content-placeholder';
				}

				return $this->render_element_placeholder( $placeholder_data );
			}

			// Avoid infinite loop.
			static $post_content_loop = 0;

			if ( $post_content_loop < 2 ) {
				++$post_content_loop;

				// Store the current main render_data self::$elements.
				$store_elements = \Bricks\Frontend::$elements;

				$output = \Bricks\Frontend::render_data( $bricks_data );

				// Reset the main render_data self::$elements.
				\Bricks\Frontend::$elements = $store_elements;

				// Add elements & global classes CSS inline in the builder or frontend (with Query Loop + External Files)
				// Don't add global classes CSS when rendering static area e.g. show outer post content (@since 1.12.3).
				if ( ! isset( $_POST['staticArea'] ) && ( bricks_is_builder() || bricks_is_builder_call() || ( \Bricks\Query::is_looping() && \Bricks\Database::get_setting( 'cssLoading' ) === 'file' ) ) ) {
					\Bricks\Assets::$inline_css['content'] = '';

					// Clear the list of elements already styled.
					\Bricks\Assets::$css_looping_elements = [];

					\Bricks\Assets::generate_css_from_elements( $bricks_data, 'content' );
					$inline_css = \Bricks\Assets::$inline_css['content'];

					// Add global classes CSS.
					$inline_css_global_classes = \Bricks\Assets::generate_global_classes();
					$inline_css               .= \Bricks\Assets::$inline_css['global_classes'];

					$output .= "\n <style>{$inline_css}</style>";
				}

				--$post_content_loop;
			}
		}

		// STEP: Render WordPress content.
		else {
			global $wp_query;
			$product    = sc_get_product();
			$no_content = [
				'title' => esc_html__( 'No WordPress added content found.', 'surecart' ),
			];

			if ( ! $product ) {
				return $this->render_element_placeholder( $no_content );
			}

			$post = $product->post ?? null;
			if ( ! $post ) {
				return $this->render_element_placeholder( $no_content );
			}

			// Set global in_the_loop().
			// Some plugins might rely on the `in_the_loop` check (e.g. BuddyBoss).
			$wp_query->in_the_loop = true;
			setup_postdata( $post );

			$output = get_the_content();
			if ( post_password_required( $post->ID ) ) {
				$output = get_the_password_form( $post->ID ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}

			if ( bricks_is_builder_call() && ! $output ) {
				return $this->render_element_placeholder( $no_content );
			}

			// Reset postdata before any return.
			wp_reset_postdata();
		}

		// Only render if not empty.
		if ( $output ) {
			echo "<div {$this->render_attributes( '_root' )}>$output</div>"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}
}
