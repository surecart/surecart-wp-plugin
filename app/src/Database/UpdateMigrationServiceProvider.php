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
	 * @return void
	 */
	public function handleCartMigration() {

		$existing_cart_post = \Surecart::cartPost()->get();
		if(empty($existing_cart_post->post_content)){
			return;
		}

		$cart = [
			'post_name' => _x( 'cart', 'Cart slug', 'surecart' ),
			'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
			'post_content' => $existing_cart_post->post_content,
			'post_type' => 'wp_template_part',
			'post_author' => $existing_cart_post->post_author,
			'post_status' => $existing_cart_post->post_status ?? 'publish',
			'post_excerpt' => $existing_cart_post->post_excerpt ?? __( 'Display all individual cart content unless a custom template has been applied.', 'surecart' )
		];

		// if a post with title 'Cart' exists and post_type is 'wp_template_part' then update the post.
		$query = new \WP_Query([
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
			'posts_per_page' => 1,
		]);


		if($query->have_posts()){
			$cart['ID'] = $query->posts[0]->ID;
			wp_update_post($cart);
		}
		else {
			wp_insert_post($cart);
		}

		// delete the old cart post.
		// wp_delete_post($existing_cart_post->ID);
	}
}
