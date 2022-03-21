<?php
namespace CheckoutEngine\Activation;

/**
 * Service for plugin activation.
 */
class ActivationService {
	/**
	 * Holds the roles service.
	 *
	 * @var \CheckoutEngine\Permissions\RolesService
	 */
	protected $roles = null;

	/**
	 * Holds the roles service.
	 *
	 * @var \CheckoutEngine\WordPress\Pages\PageSeeder
	 */
	protected $seeder = null;

	/**
	 * Get dependencies for this service.
	 *
	 * @param \CheckoutEngine\Permissions\RolesService   $roles Roles service.
	 * @param \CheckoutEngine\WordPress\Pages\PageSeeder $seeder Seeder service.
	 */
	public function __construct( \CheckoutEngine\Permissions\RolesService $roles, \CheckoutEngine\WordPress\Pages\PageSeeder $seeder ) {
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
