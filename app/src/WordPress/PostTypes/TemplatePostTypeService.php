<?php

namespace SureCart\WordPress\PostTypes;

use SureCart\WordPress\Pages\PageService;
use WP_Block_Template;

/**
 * Form post type service class.
 */
class TemplatePostTypeService {

	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_product';

	/**
	 * Bootstrap service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerPostType' ] );
	}

	public function registerPostType() {
		register_post_type(
			$this->post_type,
			array(
				'labels'          => array(
					'name'                     => _x( 'SureCart Products', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart Product', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart Product', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart Product', 'surecart' ),
					'new_item'                 => __( 'New SureCart Product', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart Product', 'surecart' ),
					'view_item'                => __( 'View SureCart Product', 'surecart' ),
					'all_items'                => __( 'All SureCart Products', 'surecart' ),
					'search_items'             => __( 'Search SureCart Products', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart Products list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart Products list', 'surecart' ),
					'item_published'           => __( 'SureCart Product published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart Product published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart Product reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart Product scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart Product updated.', 'surecart' ),
				),
				'public'          => true,
				'show_ui'         => false,
				'show_in_menu'    => false,
				'rewrite'         => false,
				'show_in_rest'    => true,
				'rest_base'       => 'sc-cart',
				'capability_type' => 'post',
				'map_meta_cap'    => true,
				'supports'        => array(
					'custom-fields',
				),
			)
		);
	}

	/**
	 * Fix autosave error with template fetching.
	 *
	 * @param \WP_Template $template The block template.
	 * @param string       $id The requested template id.
	 *
	 * @return void
	 */
	public function fixAutoSave( $template, $id ) {
		if ( strpos( $id, '/autosaves' ) !== false ) {
			return get_block_template( str_replace( '/autosaves', '', $id ) );
		}
		if ( strpos( $id, '/autosave' ) !== false ) {
			return get_block_template( str_replace( '/autosave', '', $id ) );
		}
		return $template;
	}

	/**
	 * Set the default template.
	 *
	 * @param string $template The template string.
	 *
	 * @return string
	 */
	public function setDefaultTemplate( $template ) {
		if ( ! $template ) {
			return ABSPATH . WPINC . '/template-canvas.php';
		}
		return $template;
	}

	/**
	 * Add our admin bar styles.
	 *
	 * @return void
	 */
	public function adminBarStyles() {
		wp_add_inline_style(
			'admin-bar',
			'#wpadminbar #wp-admin-bar-edit-sc-template > .ab-item:before {
			content: "\f100";
			top: 2px;
			}'
		);
	}

	/**
	 * Update the document title name to match the product name.
	 *
	 * @param array $parts The parts of the document title.
	 */
	public function documentTitle( $parts ) {
		global $sc_product;
		if ( empty( $sc_product->name ) ) {
			return $parts;
		}
		$parts['title'] = $sc_product->name;
		return $parts;
	}

	/**
	 * Add edit links
	 *
	 * @param \WP_Admin_bar $wp_admin_bar The admin bar.
	 *
	 * @return void
	 */
	public function addEditLinks( $wp_admin_bar ) {
		global $sc_product;
		if ( empty( $sc_product->id ) ) {
			return;
		}
		$wp_admin_bar->add_node(
			[
				'id'    => 'edit',
				'title' => __( 'Edit Product', 'surecart' ),
				'href'  => esc_url( \SureCart::getUrl()->edit( 'product', $sc_product->id ) ),
			]
		);

		if ( ! empty( $sc_product->template->wp_id ) ) {
			$link = admin_url( sprintf( 'post.php?post=%1d&action=edit&product=%2s', $sc_product->template->wp_id, $sc_product->id ) );
			// ( current_theme_supports( 'block-template-parts' ) || wp_is_block_theme() ) ? admin_url( sprintf( 'site-editor.php?postType=wp_template&postId=%s', $sc_product->template->id ) ) :
			$wp_admin_bar->add_node(
				[
					'id'    => 'edit-sc-template',
					'title' => __( 'Edit Template', 'surecart' ),
					'href'  => esc_url( $link ),
				]
			);
		}
	}


	/**
	 * Whitelist surecart specific templates to edit in post edit screen.
	 *
	 * @param array  $args Register post type args.
	 * @param string $post_type The post type.
	 *
	 * @return array
	 */
	public function whitelistUI( $args, $post_type ) {
		// just templates.
		if ( 'wp_template' !== $post_type ) {
			return $args;
		}

		// show the UI if it's a surecart template.
		$args['show_ui']     = true;
		$args['public']      = true;
		$args['has_archive'] = true;

		// return args.
		return $args;
	}

	/**
	 * Add our template identifier to the REST field.
	 *
	 * @return void
	 */
	public function addRestField() {
		register_rest_field(
			'wp_template',
			'is_surecart_template',
			array(
				'get_callback'    => function() {
					return get_post_meta( get_the_ID(), 'is_surecart_template', true );
				},
				'update_callback' => function( $value, $object ) {
					return update_post_meta( $object->ID, 'is_surecart_template', (bool) $value );
				},
			)
		);
	}

	/**
	 * Maybe set the url if needed.
	 *
	 * @param string $url The url.
	 *
	 * @return string
	 */
	public function maybeSetUrl( $url ) {
		global $sc_product;
		if ( empty( $sc_product->id ) ) {
			return $url;
		}
		return \SureCart::routeUrl( 'product', [ 'id' => $sc_product->id ] );
	}

	/**
	 * If there is no template yet, let's use our default one.
	 *
	 * @param \WP_Block_Template $template The template.
	 * @param string             $id The template id.
	 *
	 * @return \WP_Block_Template|false
	 */
	public function maybeAddDefaultTemplate( $template, $id ) {
		// already a template.
		if ( ! empty( $template ) ) {
			return $template;
		}

		// this is not the template we are looking for.
		if ( get_stylesheet() . '//default-product-page' !== $id ) {
			return $template;
		}

		// default product page template.
		$template                 = new WP_Block_Template();
		$template->id             = $id;
		$template->theme          = get_stylesheet();
		$template->content        = '<!-- wp:surecart/product-info {"media_position":"right","column_gap":"3em","align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|70","right":"0","bottom":"var:preset|spacing|70","left":"0"}}}} -->
		<!-- wp:surecart/product-title {"fontSize":"x-large"} /-->

		<!-- wp:surecart/product-price {"style":{"typography":{"fontSize":"16px"}}} /-->

		<!-- wp:surecart/product-price-choices /-->

		<!-- wp:surecart/product-quantity {"label":"Quantity","style":{"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} /-->

		<!-- wp:surecart/product-buy-buttons /-->

		<!-- wp:surecart/product-description /-->

		<!-- /wp:surecart/product-info -->';
		$template->source         = 'surecart';
		$template->origin         = null;
		$template->type           = 'wp_template';
		$template->description    = '';
		$template->title          = __( 'Default Product Page', 'surecart' );
		$template->status         = 'publish';
		$template->has_theme_file = false;
		$template->is_custom      = true;

		return $template;
	}
}
