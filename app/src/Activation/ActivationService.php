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
		register_deactivation_hook( SURECART_PLUGIN_FILE, [ $this, 'deactivate' ] );
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
}
