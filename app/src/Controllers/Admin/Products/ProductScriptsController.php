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
		$this->data['metaBoxLocations']   = \SureCart::metaboxes()->perLocation();
		$this->data['wpMetaBoxUrl']       = $this->getMetaBoxUrl();
		parent::enqueue();
	}

	/**
	 * Override the enqueueComponents method to add the product block editor styles.
	 *
	 * @return void
	 */
	public function enqueueComponents() {
		parent::enqueueComponents();

		// Set current screen as block editor screen.
		$current_screen = get_current_screen();
		$current_screen->is_block_editor( true );

		add_filter( 'register_block_type_args', array( $this, 'registerMetadataAttribute' ) );
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

	/**
	 * Get the meta box url.
	 *
	 * @return string
	 */
	protected function getMetaBoxUrl() {
		global $post;
		$meta_box_url = admin_url( 'post.php' );
		$meta_box_url = add_query_arg(
			array(
				'post'                  => $post->ID ?? 0,
				'action'                => 'edit',
				'meta-box-loader'       => true,
				'meta-box-loader-nonce' => wp_create_nonce( 'meta-box-loader' ),
			),
			$meta_box_url
		);
		return $meta_box_url;
	}
}
