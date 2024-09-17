<?php
/**
 * Plugin service.
 *
 * @package   SureCartAppCore
 * @author    SureCart <support@surecart.com>
 * @copyright  SureCart
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com
 */

namespace SureCart\WordPress;

use SureCartCore\Application\Application;

/**
 * Main communication channel with the theme.
 */
class PluginService {
	/**
	 * Application instance.
	 *
	 * @var Application
	 */
	protected $app = null;

	/**
	 * List of versions to show the update notice.
	 *
	 * @var array
	 */
	protected $show_update_notice_versions = [
		'3.0.0',
	];

	/**
	 * Constructor.
	 *
	 * @param Application $app Application instance.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Bootstrap the plugin.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'in_plugin_update_message-' . SURECART_PLUGIN_BASE, array( $this, 'updateMessage' ) );
	}

	/**
	 * Should show update notice?
	 *
	 * @return boolean
	 */
	public function shouldShowUpdateNotice() {
		$highest_version = max( $this->show_update_notice_versions );
		return version_compare( $this->version(), $highest_version, '>=' );
	}

	/**
	 * Display the update message.
	 *
	 * @param array $plugin_data Plugin data.
	 *
	 * @return void
	 */
	public function updateMessage( $plugin_data ) {
		if ( ! $this->shouldShowUpdateNotice() ) {
			return;
		}

		// Enqueue the plugin upgrade notice styles.
		wp_enqueue_style( 'surecart-plugin-upgrade-notice', plugins_url( 'styles/plugin-upgrade-notice.css', SURECART_PLUGIN_FILE ), '', $this->version(), 'all' );

		// Display the update warning if the condition is met.
		$this->versionUpdateWarning();
	}

	/**
	 * Display a warning if the plugin version has changed.
	 *
	 * @return void
	 */
	public function versionUpdateWarning() {
		?>
		<hr class="sc-major-update-warning__separator" />
		<div class="sc-major-update-warning">
			<div class="sc-major-update-warning__icon">
				<span class="dashicons dashicons-info"></span>
			</div>
			<div>
				<div class="sc-major-update-warning__title">
					<?php echo esc_html__( 'Heads up, Please backup before upgrade!', 'surecart' ); ?>
				</div>
				<div class="sc-major-update-warning__message">
					<?php
					echo wpautop(
						sprintf(
							/* translators: %1$s Link open tag, %2$s: Link close tag. */
							esc_html__( 'We’re excited to announce that the latest update brings significant improvements to your plugin experience! To ensure a smooth transition, we strongly recommend you %1$sbackup your site%2$s before proceeding with the update and perform the upgrade in a staging environment first.', 'surecart' ),
							'<a href="https://surecart.com" target="_blank">',
							'</a>'
						)
					);
					?>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Get the plugin version
	 *
	 * @return string
	 */
	public function version() {
		// Load version from plugin data.
		if ( ! \function_exists( 'get_plugin_data' ) ) {
			require_once \ABSPATH . 'wp-admin/includes/plugin.php';
		}

		return \get_plugin_data( SURECART_PLUGIN_FILE, false, false )['Version'];
	}

	/**
	 * Has the plugin version changed?
	 *
	 * @return boolean
	 */
	public function versionChanged() {
		return version_compare( $this->version(), get_option( 'surecart_migration_version', '0.0.0' ), '!=' );
	}

	/**
	 * Shortcute to \SureCart\Account\AccountService
	 *
	 * @return \SureCart\Account\AccountService
	 */
	public function account() {
		return $this->app->reolve( 'surecart.account' );
	}

	/**
	 * Shortcut to \SureCart\Install\InstallService.
	 *
	 * @return \SureCart\Install\InstallService
	 */
	public function install() {
		return $this->app->resolve( 'surecart.install' );
	}

	/**
	 * Shortcut to \SureCart\WordPress\Pages\PageService.
	 *
	 * @return \SureCart\WordPress\Pages\PageService
	 */
	public function pages() {
		return $this->app->resolve( 'surecart.pages' );
	}
	/**
	 * Shortcut to \SureCart\WordPress\Pages\PageService.
	 *
	 * @return \SureCart\WordPress\Pages\PageService
	 */
	public function activation() {
		return $this->app->resolve( 'surecart.activation' );
	}

	/**
	 * Shortcut to \SureCart\WordPress\Pages\PageService.
	 *
	 * @return \SureCart\Permissions\RolesService;
	 */
	public function roles() {
		return $this->app->resolve( 'surecart.permissions.roles' );
	}
}
