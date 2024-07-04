<?php

namespace SureCart\Database;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * This service provider runs on every single update.
 */
class UpdateMigrationServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		// nothing to register.
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		// only run the migration if the version changes.
		add_action( 'admin_init', [ $this, 'run' ] );
		// update the migration version on admin_init lower priority, after all migrations have run.
		add_action( 'admin_init', [ $this, 'updateMigrationVersion' ], 9999999 );
	}

	/**
	 * Run the migration.
	 */
	public function run() {
		if ( ! $this->versionChanged() ) {
			return;
		}
		// flush roles on every update.
		\SureCart::plugin()->roles()->create();
		// make sure to check for and create cart post on every update.
		\SureCart::page_seeder()->createShopPage();
		// make sure to check for and create cart post on every update.
		$this->handleCartMigration();
		// update the product page to have a wrapper block.
		$this->handleProductPageMigration();
	}

	/**
	 * Update the migration version.
	 *
	 * @return void
	 */
	public function updateMigrationVersion() {
		if ( ! $this->versionChanged() ) {
			return;
		}
		update_option( 'surecart_migration_version', \SureCart::plugin()->version() );
	}

	/**
	 * Version has changed?
	 *
	 * @return boolean
	 */
	public function versionChanged() {
		return version_compare( \SureCart::plugin()->version(), get_option( 'surecart_migration_version', '0.0.0' ), '!=' );
	}

	/**
	 * Handle cart migration
	 *
	 * @return \WP_Post|WP_Error
	 */
	public function handleCartMigration() {
		// get the existing cart post.
		$existing_cart_post = \SureCart::cartPost()->get();

		// we don't have a cart post - it's possibly been deleted or not seeded.
		if ( empty( $existing_cart_post ) || empty( $existing_cart_post->post_content ) ) {
			return;
		}

		// get the defined template.
		$template = get_block_template( 'surecart/surecart//cart', 'wp_template_part' );

		// it has already been modified.
		if ( ! empty( $template->wp_id ) ) {
			return;
		}

		$cart = [
			'post_name'    => 'cart',
			'post_title'   => $template->title,
			'post_status'  => 'publish',
			'tax_input'    => [
				'wp_template_part_area' => WP_TEMPLATE_PART_AREA_UNCATEGORIZED,
				'wp_theme'              => $template->theme,
			],
			'meta_input'   => [
				'origin' => 'plugin',
			],
			'post_type'    => 'wp_template_part',
			'post_content' => \SureCart\Cart\CartService::removeDeprecatedCartContent( $existing_cart_post->post_content ),
			'post_excerpt' => $template->description,
		];

		// Create the template.
		$result = wp_insert_post( wp_slash( $cart, false ) );

		// insertion failed.
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		// delete all cart posts.
		$allposts = get_posts(
			array(
				'post_type'   => 'sc_cart',
				'numberposts' => -1,
				'fields'      => 'ids',
			)
		);
		foreach ( $allposts as $eachpost ) {
			wp_delete_post( $eachpost, true );
		}

		// return result.
		return $result;
	}

	/**
	 * Handle the product page migration.
	 *
	 * @return void
	 */
	public function handleProductPageMigration() {
		$args = array(
			'post_type'           => array( 'wp_template_part', 'wp_template' ), // specify the post types.
			'post_status'         => array( 'auto-draft', 'draft', 'publish' ), // specify the post status.
			'posts_per_page'      => -1,
			'lazy_load_term_meta' => false,
		);

		$query     = new \WP_Query( $args );
		$templates = $query->posts ?? array();

		if ( empty( $templates ) ) {
			return;
		}

		// filter out the templates that have post_name as product.
		$product_templates = array_filter(
			$templates,
			function ( $template ) {
				return in_array( $template->post_name, array( 'product-info', 'single-product' ) ) ||
				strpos( $template->post_name, 'sc-part-products-info-' ) !== false ||
				strpos( $template->post_name, 'sc-products-' ) !== false;
			}
		);

		// if we don't have any product templates, return.
		if ( empty( $product_templates ) ) {
			return;
		}

		// update each template if it doesn't have the wp:surecart/product-page block.
		foreach ( $product_templates as $product_template ) {

			if ( ! has_block( 'surecart/product-page', $product_template ) ) {
				wp_update_post(
					array(
						'ID'           => $product_template->ID,
						'post_content' => '<!-- wp:surecart/product-page -->' . $product_template->post_content . '<!-- /wp:surecart/product-page -->',
					)
				);
			}

			if ( ! has_block( 'surecart/product-selected-price-ad-hoc-amount', $product_template ) ) {
				$insert_before_block = has_block( 'surecart/product-buy-buttons', $product_template ) ? 'surecart/product-buy-buttons' : 'surecart/product-buy-button';

				$new_content = str_replace(
					'<!-- wp:' . $insert_before_block,
					'<!-- wp:surecart/product-selected-price-ad-hoc-amount /-->' . PHP_EOL . '<!-- wp:' . $insert_before_block,
					$product_template->post_content
				);

				wp_update_post(
					array(
						'ID'           => $product_template->ID,
						'post_content' => $new_content,
					)
				);
			}
		}
	}
}
