<?php
namespace CheckoutEngine\Permissions;

use CheckoutEngine\Models\Product;

/**
 * Adds roles and capabilities.
 */
class RolesService {
	public function __construct() {
		add_filter( 'map_meta_cap', [ $this, 'metaCaps' ], 10, 4 );
	}

	/**
	 * Create roles and caps.
	 *
	 * @return void
	 */
	public function createRoles() {
		$this->addRoles();
		$this->addCaps();
	}

	/**
	 * Add Roles.
	 *
	 * @return void
	 */
	public function addRoles() {
		add_role(
			'pk_shop_manager',
			__( 'PayKit Shop Manager', 'checkout_engine' ),
			[
				'read'                   => true,
				'edit_posts'             => true,
				'delete_posts'           => true,
				'unfiltered_html'        => true,
				'upload_files'           => true,
				'export'                 => true,
				'import'                 => true,
				'delete_others_pages'    => true,
				'delete_others_posts'    => true,
				'delete_pages'           => true,
				'delete_private_pages'   => true,
				'delete_private_posts'   => true,
				'delete_published_pages' => true,
				'delete_published_posts' => true,
				'edit_others_pages'      => true,
				'edit_others_posts'      => true,
				'edit_pages'             => true,
				'edit_private_pages'     => true,
				'edit_private_posts'     => true,
				'edit_published_pages'   => true,
				'edit_published_posts'   => true,
				'manage_categories'      => true,
				'manage_links'           => true,
				'moderate_comments'      => true,
				'publish_pages'          => true,
				'publish_posts'          => true,
				'read_private_pages'     => true,
				'read_private_posts'     => true,
			]
		);

		add_role(
			'pk_shop_accountant',
			__( 'PayKit Accountant', 'checkout_engine' ),
			[
				'read'         => true,
				'edit_posts'   => false,
				'delete_posts' => false,
			]
		);

		add_role(
			'pk_shop_worker',
			__( 'PayKit Shop Worker', 'checkout_engine' ),
			[
				'read'         => true,
				'edit_posts'   => false,
				'upload_files' => true,
				'delete_posts' => false,
			]
		);
	}

	/**
	 * Add new shop-specific capabilities
	 *
	 * @since  1.4.4
	 * @global WP_Roles $wp_roles
	 * @return void
	 */
	public function addCaps() {
		global $wp_roles;

		if ( class_exists( 'WP_Roles' ) ) {
			if ( ! isset( $wp_roles ) ) {
				$wp_roles = new \WP_Roles();
			}
		}

		if ( is_object( $wp_roles ) ) {
			$wp_roles->add_cap( 'pk_shop_manager', 'view_pk_shop_reports' );
			$wp_roles->add_cap( 'pk_shop_manager', 'view_pk_shop_sensitive_data' );
			$wp_roles->add_cap( 'pk_shop_manager', 'export_pk_shop_reports' );
			$wp_roles->add_cap( 'pk_shop_manager', 'manage_pk_shop_settings' );

			$wp_roles->add_cap( 'administrator', 'view_pk_shop_reports' );
			$wp_roles->add_cap( 'administrator', 'view_pk_shop_sensitive_data' );
			$wp_roles->add_cap( 'administrator', 'export_pk_shop_reports' );
			$wp_roles->add_cap( 'administrator', 'manage_pk_shop_settings' );
			$wp_roles->add_cap( 'administrator', 'manage_pk_account_settings' );

			// Add the main model capabilities
			$capabilities = $this->getModelCaps();
			foreach ( $capabilities as $cap_group ) {
				foreach ( $cap_group as $cap ) {
					$wp_roles->add_cap( 'administrator', $cap );
					$wp_roles->add_cap( 'pk_shop_manager', $cap );
					$wp_roles->add_cap( 'pk_shop_worker', $cap );
				}
			}

			$wp_roles->add_cap( 'pk_shop_accountant', 'edit_pk_products' );
			$wp_roles->add_cap( 'pk_shop_accountant', 'view_pk_shop_reports' );
			$wp_roles->add_cap( 'pk_shop_accountant', 'export_pk_shop_reports' );
			$wp_roles->add_cap( 'pk_shop_accountant', 'edit_pk_shop_charges' );
		}
	}

	/**
	 * Gets the core post type capabilities
	 *
	 * @since  1.4.4
	 * @return array $capabilities Core post type capabilities
	 */
	public function getModelCaps() {
		$capabilities = [];

		$capability_types = [
			'pk_coupon',
			'pk_promotion',
			'pk_product',
			'pk_price',
			'pk_order',
			'pk_charge',
			'pk_subscription',
		];

		foreach ( $capability_types as $capability_type ) {
			$capabilities[ $capability_type ] = array(
				// Models.
				"edit_{$capability_type}", // edit.
				"read_{$capability_type}", // read.
				"delete_{$capability_type}", // delete.
				"edit_{$capability_type}s", // edit all.
				"edit_others_{$capability_type}s", // edit others.
				"publish_{$capability_type}s", // publish.
				"delete_{$capability_type}s", // delete.
				"delete_others_{$capability_type}s", // delete others.

				// Stats.
				"view_{$capability_type}_stats",
			);
		}

		return $capabilities;
	}


	/**
	 * Meta caps for models
	 *
	 * @param array  $caps Primitive capabilities required of the user.
	 * @param string $cap     Capability being checked.
	 * @param int    $user_id User ID.
	 * @param mixed  $args Optional further parameters, typically starting with an object ID.
	 * @return string[] Primitive capabilities required of the user.
	 */
	public function metaCaps( $caps, $cap, $user_id, $args ) {
		switch ( $cap ) {
			case 'view_product_stats':
				if ( empty( $args[0] ) ) {
					break;
				}

				$product = Product::find( $args[0] );
				if ( empty( $product ) ) {
					break;
				}

				// allowed if they can edit others products or they created it
				if ( user_can( $user_id, 'edit_others_products' ) || $user_id == $product->created_by ) {
					$caps = array();
				}

				break;
		}

		return $caps;
	}
}
