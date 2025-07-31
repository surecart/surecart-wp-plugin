<?php

namespace SureCart\Integrations\Elementor;

use SureCart\Migration\ProductPageWrapperService;

/**
 * Elementor block adapter service.
 */
class ElementorBlockAdapterService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'elementor/frontend/container/before_render', [ $this, 'addProductWrapperStart' ] );
		add_action( 'elementor/frontend/container/after_render', [ $this, 'addProductWrapperEnd' ] );
		add_action( 'elementor/frontend/before_get_builder_content', [ $this, 'preReturnSerializedBlock' ] );
		add_action( 'elementor/frontend/the_content', [ $this, 'doBlocksAtEnd' ], 10 );
		add_action( 'elementor/element/container/section_layout_container/after_section_start', [ $this, 'injectProductFormControls' ], 10 );
		add_filter( 'elementor/frontend/the_content', [ $this, 'showAlertIfNotUsingProductWrapper' ], 11 );
		add_filter( 'surecart/product/replace_content_with_product_info_part', [ $this, 'doNotReplaceContentIfRenderingWithElementor' ] );
	}

	/**
	 * Add product wrapper start.
	 *
	 * @param \Elementor\Widget_Base $element The element.
	 *
	 * @return void
	 */
	public function addProductWrapperStart( $element ) {
		$settings = $element->get_settings_for_display();
		if ( 'surecart_form' === $settings['surecart_container_type'] ) {
			echo '<!-- wp:surecart/product-page {"align":"wide"} -->';
		}
	}

	/**
	 * Add product wrapper end.
	 *
	 * @param \Elementor\Widget_Base $element The element.
	 *
	 * @return void
	 */
	public function addProductWrapperEnd( $element ) {
		$settings = $element->get_settings_for_display();
		if ( 'surecart_form' === $settings['surecart_container_type'] ) {
			echo '<!-- /wp:surecart/product-page -->';
		}
	}

	/**
	 * Adds the block serialization filter before Elementor content is processed.
	 *
	 * @return void
	 */
	public function preReturnSerializedBlock(): void {
		add_filter( 'pre_render_block', [ $this, 'serializeBlock' ], 10, 2 );
	}

	/**
	 * Disable Elementor render block.
	 *
	 * @param array $rendered The rendered block.
	 * @param array $parsed_block The parsed block.
	 *
	 * @return array
	 */
	public function serializeBlock( $rendered, $parsed_block ) {
		// don't serialize if it includes the surecart/ prefix.
		if ( strpos( $parsed_block['blockName'] ?? '', 'surecart/' ) !== false ) {
			return $rendered;
		}

		return $rendered;
	}

	/**
	 * Process Elementor content and remove the serialization filter.
	 *
	 * @param string $content The content to process.
	 *
	 * @return string The processed content
	 */
	public function doBlocksAtEnd( string $content ): string {
		remove_filter( 'pre_render_block', [ $this, 'serializeBlock' ], 10, 2 );
		return do_blocks( $content );
	}

	/**
	 * Inject product form controls.
	 *
	 * @param \Elementor\Widget_Base $element The element.
	 *
	 * @return void
	 */
	public function injectProductFormControls( $element ) {
		$element->add_control(
			'surecart_container_type',
			[
				'type'    => \Elementor\Controls_Manager::SELECT,
				'label'   => esc_html__( 'Container Type', 'surecart' ),
				'default' => 'default',
				'options' => [
					'default'       => esc_html__( 'Default', 'surecart' ),
					'surecart_form' => esc_html__( 'Product Form', 'surecart' ),
				],
			]
		);
	}

	/**
	 * Show alert if not using product wrapper.
	 *
	 * @param string $content The content.
	 *
	 * @return string
	 */
	public function showAlertIfNotUsingProductWrapper( $content ) {
		// Show only to the users who has the permissions to edit the post
		// and if the current post is a product.
		if (
			! current_user_can( 'edit_posts', get_the_ID() ) ||
			! sc_get_product()
		) {
			return $content;
		}

		$orphaned_blocks = $this->findOrphanedSurecartBlocks( $content );
		if ( empty( $orphaned_blocks ) ) {
			return $content;
		}

		$alert  = '<div class="sc-alert sc-alert-warning" style="margin:1em 0;padding:1em;border:1px solid #ffc107;background:#fff3cd;color:#856404;">';
		$alert .= sprintf(
			/* translators: %s: URL to the SureCart Elementor documentation page. */
			esc_html__( '⚠️ Warning: SureCart widgets must be placed inside a "Product Form" container to function properly. &nbsp; %s', 'surecart' ),
			'<a href="https://surecart.com/docs/product-page-in-elementor" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Learn more', 'surecart' ) . '</a>'
		);
		$alert .= '</div>';

		return $alert . $content;
	}

	/**
	 * Do not replace content if rendering with and elementor template.
	 *
	 * @param bool $replace_content The replace content.
	 *
	 * @return bool
	 */
	public function doNotReplaceContentIfRenderingWithElementor( $replace_content ) {
		$document = \Elementor\Plugin::$instance->documents->get_current();
		if ( ! empty( $document ) ) {
			return false;
		}

		return $replace_content;
	}

	/**
	 * Find orphaned surecart blocks.
	 *
	 * @param string $content The content.
	 *
	 * @return array
	 */
	public function findOrphanedSurecartBlocks( $content ) {
		$processor       = new \WP_HTML_Tag_Processor( $content );
		$inside_form     = false;
		$orphaned_blocks = [];

		// Set a bookmark at the start to return to it later if needed.
		$processor->next_tag();
		$processor->set_bookmark( 'start' );

		while ( $processor->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
			$tag_name = strtolower( $processor->get_tag() );

			// Track when we enter/exit form tags.
			if ( 'form' === $tag_name && ! $processor->is_tag_closer() ) {
				$inside_form = true;
				continue;
			}
			if ( 'form' === $tag_name && $processor->is_tag_closer() ) {
				$inside_form = false;
				continue;
			}

			// If we're not inside a form, check for the class.
			if ( ! $inside_form ) {
				$class = $processor->get_attribute( 'class' ) ?? '';

				if ( preg_match( '/wp-block-surecart-(?:product|price)-/', $class ) ) {
					$orphaned_blocks[] = [
						'tag'   => $processor->get_tag(),
						'class' => $class,
					];
				}
			}
		}

		return $orphaned_blocks;
	}
}
