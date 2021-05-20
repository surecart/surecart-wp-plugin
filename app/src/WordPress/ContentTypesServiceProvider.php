<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register widgets and sidebars.
 */
class ContentTypesServiceProvider implements ServiceProviderInterface
{
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		add_action( 'init', [$this, 'registerPostTypes'] );
		add_action( 'init', [$this, 'registerTaxonomies'] );
	}

	/**
	 * Register post types.
	 *
	 * @return void
	 */
	public function registerPostTypes() {
		// phpcs:disable
		/*
		register_post_type(
			'checkout_engine_custom_post_type',
			array(
				'labels'              => array(
					'name'               => __( 'Custom Types', 'checkout_engine' ),
					'singular_name'      => __( 'Custom Type', 'checkout_engine' ),
					'add_new'            => __( 'Add New', 'checkout_engine' ),
					'add_new_item'       => __( 'Add new Custom Type', 'checkout_engine' ),
					'view_item'          => __( 'View Custom Type', 'checkout_engine' ),
					'edit_item'          => __( 'Edit Custom Type', 'checkout_engine' ),
					'new_item'           => __( 'New Custom Type', 'checkout_engine' ),
					'search_items'       => __( 'Search Custom Types', 'checkout_engine' ),
					'not_found'          => __( 'No custom types found', 'checkout_engine' ),
					'not_found_in_trash' => __( 'No custom types found in trash', 'checkout_engine' ),
				),
				'public'              => true,
				'exclude_from_search' => false,
				'show_ui'             => true,
				'capability_type'     => 'post',
				'hierarchical'        => false,
				'query_var'           => true,
				'menu_icon'           => 'dashicons-admin-post',
				'supports'            => array( 'title', 'editor', 'page-attributes' ),
				'rewrite'             => array(
					'slug'       => 'custom-post-type',
					'with_front' => false,
				),
			)
		);
		*/
		// phpcs:enable
	}

	/**
	 * Register taxonomies.
	 *
	 * @return void
	 */
	public function registerTaxonomies() {
		// phpcs:disable
		/*
		register_taxonomy(
			'checkout_engine_custom_taxonomy',
			array( 'post_type' ),
			array(
				'labels'            => array(
					'name'              => __( 'Custom Taxonomies', 'checkout_engine' ),
					'singular_name'     => __( 'Custom Taxonomy', 'checkout_engine' ),
					'search_items'      => __( 'Search Custom Taxonomies', 'checkout_engine' ),
					'all_items'         => __( 'All Custom Taxonomies', 'checkout_engine' ),
					'parent_item'       => __( 'Parent Custom Taxonomy', 'checkout_engine' ),
					'parent_item_colon' => __( 'Parent Custom Taxonomy:', 'checkout_engine' ),
					'view_item'         => __( 'View Custom Taxonomy', 'checkout_engine' ),
					'edit_item'         => __( 'Edit Custom Taxonomy', 'checkout_engine' ),
					'update_item'       => __( 'Update Custom Taxonomy', 'checkout_engine' ),
					'add_new_item'      => __( 'Add New Custom Taxonomy', 'checkout_engine' ),
					'new_item_name'     => __( 'New Custom Taxonomy Name', 'checkout_engine' ),
					'menu_name'         => __( 'Custom Taxonomies', 'checkout_engine' ),
				),
				'hierarchical'      => true,
				'show_ui'           => true,
				'show_admin_column' => true,
				'query_var'         => true,
				'rewrite'           => array( 'slug' => 'custom-taxonomy' ),
			)
		);
		*/
		// phpcs:enable
	}
}
