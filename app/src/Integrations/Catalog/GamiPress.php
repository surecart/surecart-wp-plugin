<?php

namespace SureCart\Integrations\Catalog;

/**
 * GamiPress integration catalog listing.
 */
class GamiPress extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'gamipress';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'GamiPress';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Customer Experience', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Gamify your customers with GamiPress to reward them for their purchases and encourage repeat business.', 'surecart' );
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getDescription() {
		ob_start();
		?>
		<h2><?php esc_html_e( 'Overview', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'GamiPress is a powerful WordPress gamification plugin that helps you reward your customers for their purchases and encourage repeat business.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect SureCart with GamiPress to automatically award points, badges, and achievements based on customer purchases and order values.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Create custom rewards and achievements that trigger when customers reach specific purchase milestones or spending thresholds.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Build customer loyalty by gamifying the shopping experience and incentivizing repeat purchases through a points-based reward system.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both GamiPress and SureCart plugins. Navigate to GamiPress settings to set up your points, achievements and rewards. Then create automation rules based on SureCart purchase events.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'gamipress';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'gamipress/gamipress.php';
	}

	/**
	 * Get the is enabled status for the integration.
	 *
	 * @return bool
	 */
	public function getIsEnabled() {
		return is_plugin_active( 'gamipress/gamipress.php' );
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/gamipress.svg' );
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://gamipress.com/add-ons/surecart-integration/';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://gamipress.com/docs/getting-started/';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://gamipress.com/contact-us/';
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'GamiPress';
	}
}
