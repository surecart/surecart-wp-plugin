<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Product Page
 */
class ProductScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'supported_currencies', 'tax_protocol', 'checkout_page_url' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/product';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/products';

	/**
	 * Add the app url to the data.
	 */
	public function __construct() {
		$this->data['api_url'] = \SureCart::requests()->getBaseUrl();
	}

	public function enqueue() {
		$available_templates              = wp_get_theme()->get_page_templates( null, 'sc_product' );
		$available_templates['']          = apply_filters( 'default_page_template_title', __( 'Theme Layout', 'surecart' ), 'rest-api' );
		$this->data['availableTemplates'] = $available_templates;
		parent::enqueue();
	}

	/**
	 * Enqueue needed scripts.
	 *
	 * @return void
	 */
	public function enqueueScriptDependencies() {
		parent::enqueueScriptDependencies();

		// Editor & media.
		wp_enqueue_style( 'wp-edit-blocks' );
		wp_enqueue_editor();

		// Format library.
		wp_enqueue_style( 'wp-format-library' );
		wp_enqueue_script( 'wp-format-library' );

		global $editor_styles;
		wp_add_inline_script(
			'wp-blocks',
			'wp.blocks && wp.blocks.unstable__bootstrapServerSideBlockDefinitions && wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
		);

		$block_editor_context = new \WP_Block_Editor_Context( array( 'name' => 'surecart/block-editor' ) );

		$indexed_template_types = array();
		foreach ( get_default_block_template_types() as $slug => $template_type ) {
			$template_type['slug']    = (string) $slug;
			$indexed_template_types[] = $template_type;
		}

		$custom_settings = array(
			'siteUrl'                   => site_url(),
			'postsPerPage'              => get_option( 'posts_per_page' ),
			'styles'                    => get_block_editor_theme_styles(),
			'defaultTemplateTypes'      => $indexed_template_types,
			'defaultTemplatePartAreas'  => get_allowed_block_template_part_areas(),
			'supportsLayout'            => wp_theme_has_theme_json(),
			'supportsTemplatePartsMode' => ! wp_is_block_theme() && current_theme_supports( 'block-template-parts' ),
		);

		$custom_settings['__experimentalAdditionalBlockPatterns']          = \WP_Block_Patterns_Registry::get_instance()->get_all_registered( true );
		$custom_settings['__experimentalAdditionalBlockPatternCategories'] = \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered( true );

		// Get block editor settings.
		$editor_settings = get_block_editor_settings( $custom_settings, $block_editor_context );

		// Debug registered patterns before getting them.
		$patterns           = \WP_Block_Patterns_Registry::get_instance()->get_all_registered();
		$pattern_categories = \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered();

		// Add patterns in both locations to ensure compatibility.
		$editor_settings['__experimentalBlockPatterns']          = $patterns;
		$editor_settings['__experimentalBlockPatternCategories'] = $pattern_categories;

		wp_add_inline_script(
			'surecart-components',
			sprintf( 'wp.blocks?.setCategories( %s );', wp_json_encode( $editor_settings['blockCategories'] ) ),
			'before'
		);

		wp_localize_script(
			'surecart-components',
			'surecartBlockEditorSettings',
			$editor_settings
		);

		$active_global_styles_id = \WP_Theme_JSON_Resolver::get_user_global_styles_post_id();
		$active_theme            = get_stylesheet();

		$navigation_rest_route = rest_get_route_for_post_type_items(
			'wp_navigation'
		);

		$preload_paths = array(
			array( '/wp/v2/media', 'OPTIONS' ),
			'/wp/v2/types?context=view',
			'/wp/v2/types/wp_template?context=edit',
			'/wp/v2/types/wp_template-part?context=edit',
			'/wp/v2/templates?context=edit&per_page=-1',
			'/wp/v2/template-parts?context=edit&per_page=-1',
			'/wp/v2/themes?context=edit&status=active',
			'/wp/v2/global-styles/' . $active_global_styles_id . '?context=edit',
			'/wp/v2/global-styles/' . $active_global_styles_id,
			'/wp/v2/global-styles/themes/' . $active_theme,
			array( $navigation_rest_route, 'OPTIONS' ),
			array(
				add_query_arg(
					array(
						'context'   => 'edit',
						'per_page'  => 100,
						'order'     => 'desc',
						'orderby'   => 'date',
						// array indices are required to avoid query being encoded and not matching in cache .
						'status[0]' => 'publish',
						'status[1]' => 'draft',
					),
					$navigation_rest_route
				),
				'GET',
			),
		);

		block_editor_rest_api_preload( $preload_paths, $block_editor_context );

		wp_add_inline_script(
			'wp-edit-site',
			sprintf(
				'wp.domReady( function() { wp.editSite.initializeEditor( "site-editor", %s ); } );',
				wp_json_encode( $editor_settings )
			)
		);

		// Preload server-registered block schemas.
		wp_add_inline_script(
			'wp-blocks',
			'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
		);

		wp_add_inline_script(
			'wp-blocks',
			sprintf( 'wp.blocks?.setCategories( %s );', wp_json_encode( isset( $editor_settings['blockCategories'] ) ? $editor_settings['blockCategories'] : array() ) ),
			'after'
		);

		if (
			current_theme_supports( 'wp-block-styles' ) &&
			( ! is_array( $editor_styles ) || count( $editor_styles ) === 0 )
		) {
			wp_enqueue_style( 'wp-block-library-theme' );
		}

		// Global styles.
		wp_register_style( 'sc-global-presets', false ); // phpcs:ignore
		wp_add_inline_style( 'sc-global-presets', wp_get_global_stylesheet( array( 'presets' ) ) );
		wp_enqueue_style( 'sc-global-presets' );

		/**
		 * Filters the arguments used to register a block type.
		 */
		add_filter( 'register_block_type_args', array( $this, 'registerMetadataAttribute' ) );

		/**
		 * Fires after block editor assets have been enqueued.
		 */
		do_action( 'enqueue_block_editor_assets' );
	}

	/**
	 * Registers the metadata block attribute for all block types.
	 * This is a fallback/temporary solution until
	 * the Gutenberg core version registers the metadata attribute.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/6aaa3686ae67adc1a6a6b08096d3312859733e1b/lib/compat/wordpress-6.5/blocks.php#L27-L47
	 * To do: Remove this method once the Gutenberg core version registers the metadata attribute.
	 *
	 * @param array $args Array of arguments for registering a block type.
	 * @return array $args
	 */
	public function registerMetadataAttribute( $args ): array {
		// Setup attributes if needed.
		if ( ! isset( $args['attributes'] ) || ! is_array( $args['attributes'] ) ) {
			$args['attributes'] = array();
		}

		// Add metadata attribute if it doesn't exist.
		if ( ! array_key_exists( 'metadata', $args['attributes'] ) ) {
			$args['attributes']['metadata'] = array(
				'type' => 'object',
			);
		}

		return $args;
	}
}
