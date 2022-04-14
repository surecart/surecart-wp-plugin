<?php
namespace SureCart\Activation;

/**
 * Service for plugin activation.
 */
class ActivationService {
	/**
	 * Holds the roles service.
	 *
	 * @var \SureCart\Permissions\RolesService
	 */
	protected $roles = null;

	/**
	 * Holds the roles service.
	 *
	 * @var \SureCart\WordPress\Pages\PageSeeder
	 */
	protected $seeder = null;

	/**
	 * Get dependencies for this service.
	 *
	 * @param \SureCart\Permissions\RolesService   $roles Roles service.
	 * @param \SureCart\WordPress\Pages\PageSeeder $seeder Seeder service.
	 */
	public function __construct( \SureCart\Permissions\RolesService $roles, \SureCart\WordPress\Pages\PageSeeder $seeder ) {
		$this->roles  = $roles;
		$this->seeder = $seeder;
	}

	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		register_activation_hook( SURECART_PLUGIN_FILE, [ $this, 'activate' ] );
	}

	/**
	 * Create roles on plugin activation.
	 *
	 * @return void
	 */
	public function activate() {
		// create roles.
		$this->roles->create();
		// seed pages and forms.
		$this->seeder->seed();
	}

	/**
	 * Remove roles and all data.
	 *
	 * @return void
	 */
	public function uninstall() {
		// remove roles.
		$this->roles->delete();
		// remove pages that were automatically seeded.
		$this->seeder->delete();
		// remove all forms.
		$this->removeFormPosts();
		// remove all options from the options table.
		$this->removeOptions();
	}

	/**
	 * Remove all posts from our post type.
	 *
	 * @return void
	 */
	public function removeFormPosts() {
		// remove all form posts.
		$form_ids = get_posts(
			[
				'post_type'   => 'sc_form',
				'numberposts' => -1,
				'fields'      => 'ids',
			]
		);
		foreach ( $form_ids as $form_id ) {
			wp_delete_post( $form_id, true );
		}
	}

	/**
	 * Remove all our options from the options table.
	 *
	 * @return void
	 */
	public function removeOptions() {
		delete_option( 'ce_registered_webhook' );
		delete_option( 'surecart_order-confirmation_page_id' );
		delete_option( 'surecart_dashboard_page_id' );
		delete_option( 'surecart_checkout_sc_form_id' );
		delete_option( 'surecart_checkout_page_id' );
		delete_option( 'sc_webhook_signing_secret' );
		delete_option( 'sc_api_token' );
		delete_option( 'sc_uninstall' );
	}
}
