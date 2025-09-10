<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle elementor templates.
 */
class ElementorTemplatesService {
	/**
	 * Templates directory path.
	 *
	 * @var string
	 */
	private $templates_dir;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->templates_dir = SURECART_PLUGIN_DIR . '/templates/elementor/';
	}

	/**
	 * Get template configuration data by filename.
	 *
	 * @param string $filename Template filename without extension.
	 * @return array           Template configuration including name, image, and any other properties.
	 */
	private function get_template_config( $filename ): array {
		$templates_config = [
			'surecart-single-product-left'  => [
				'name'        => __( 'Product Form (Left)', 'surecart' ),
				'image'       => 'single-product-template-left.png',
				'type'        => 'product-form',
				'widget_name' => 'surecart-product',
				'priority'    => 10,
				'hidden'      => false,
			],
			'surecart-single-product-right' => [
				'name'        => __( 'Product Form (Right)', 'surecart' ),
				'image'       => 'single-product-template-right.png',
				'type'        => 'product-form',
				'widget_name' => '', // No widget will be registered for this template.
				'priority'    => 20,
				'hidden'      => false,
			],
			'surecart-product-card'         => [
				'name'        => __( 'Product Card', 'surecart' ),
				'image'       => 'product-card-template.png',
				'type'        => 'product-card',
				'widget_name' => 'surecart-product-card',
				'priority'    => 30,
				'hidden'      => false,
			],
			'surecart-product-pricing'      => [
				'name'        => __( 'Product Pricing', 'surecart' ),
				'image'       => 'product-pricing-template.png',
				'type'        => 'others',
				'widget_name' => 'surecart-product-pricing',
				'priority'    => 40,
				'hidden'      => true,
			],
		];

		// Get config or create default.
		$config = $templates_config[ $filename ] ?? [
			'name'     => ucwords( str_replace( [ 'surecart-', '-' ], [ '', ' ' ], $filename ) ),
			'image'    => '',
			'type'     => 'others',
			'priority' => 999,
			'hidden'   => false,
		];

		// Process the image URL.
		$config['image'] = esc_url_raw(
			trailingslashit( \SureCart::core()->assets()->getUrl() ) .
			'images/elementor/' . $config['image']
		);

		return $config;
	}

	/**
	 * Get all templates from the templates directory.
	 *
	 * @return array
	 */
	public function get_templates(): array {
		$templates = [];
		$files     = glob( $this->templates_dir . '*.json' );

		if ( ! $files ) {
			return $templates;
		}

		foreach ( $files as $file ) {
			$filename = basename( $file, '.json' );

			// Skip files that aren't templates.
			if ( strpos( $filename, 'surecart-' ) !== 0 ) {
				continue;
			}

			// Get template key.
			$template_key = $filename;

			// Get template configuration.
			$config = $this->get_template_config( $filename );

			// Get the template content.
			$template_content = $this->get_template_from_file( $filename . '.json' );

			if ( ! empty( $template_content ) ) {
				$templates[ $template_key ] = array_merge(
					$config,
					[ 'content' => $template_content ]
				);
			}
		}

		$templates = $this->sort_templates_by_priority( $templates );

		return apply_filters( 'sc_elementor_templates', $templates );
	}

	/**
	 * Sort templates by priority.
	 *
	 * @param array $templates The templates to sort.
	 * @return array Sorted templates.
	 */
	private function sort_templates_by_priority( array $templates ): array {
		uasort(
			$templates,
			function ( $a, $b ) {
				return ( $a['priority'] ?? 999 ) <=> ( $b['priority'] ?? 999 );
			}
		);

		return $templates;
	}

	/**
	 * Get Elementor template from file.
	 *
	 * @param string $file_name The file name.
	 *
	 * @return array
	 */
	public function get_template_from_file( string $file_name ) {
		try {
			$template_path    = $this->templates_dir . $file_name;
			$template_content = file_get_contents( $template_path ); // phpcs:ignore

			return isset( $template_content ) ? json_decode( $template_content, true ) : [];
		} catch ( \Throwable $th ) {
			error_log( 'Error while reading the template file: ' . $th->getMessage() );
			return [];
		}
	}

	/**
	 * Check if the current page/template is rendered by Elementor and contains SureCart product template.
	 *
	 * @return bool
	 */
	public function isRenderedWithElementor(): bool {
		if ( ! class_exists( 'Elementor\Plugin' ) ) {
			return false;
		}

		// If has custom page template, means its rendering from SureCart template, not with Elementor.
		if ( ! empty( get_post_meta( get_the_ID(), '_wp_page_template', true ) ) ) {
			return false;
		}

		return $this->hasActiveSureCartElementorTemplate();
	}

	/**
	 * Check if surecart-product Elementor template is active.
	 *
	 * @return bool
	 */
	public function hasActiveSureCartElementorTemplate(): bool {
		$templates = get_posts(
			[
				'post_type'      => 'elementor_library',
				'meta_query'     => [
					[
						'key'   => '_elementor_template_type',
						'value' => 'surecart-product',
					],
					[
						'key'   => '_elementor_edit_mode',
						'value' => 'builder',
					],
				],
				'posts_per_page' => 1,
			]
		);

		return ! empty( $templates );
	}
}
