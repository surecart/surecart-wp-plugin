<?php

namespace SureCart\Integrations\Catalog;

/**
 * BuddyBoss integration catalog listing.
 */
class BuddyBoss extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/buddyboss';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'BuddyBoss';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Community / Network', 'surecart' ), __( 'Courses & Online Learning', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Integrate BuddyBoss with SureCart to monetize your community platform with a powerful checkout experience.', 'surecart' );
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
		<p><?php esc_html_e( 'BuddyBoss is a comprehensive platform solution that transforms WordPress into a full-featured social network, learning management system, and community platform.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect BuddyBoss with SureCart to monetize your community features. Sell access to groups, courses, and community features through SureCart\'s optimized checkout process.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'When members purchase access through SureCart, they automatically gain entry to their purchased community features, creating a seamless onboarding experience.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Leverage SureCart\'s powerful features like multiple payment options, subscription management, and abandoned cart recovery to grow your community platform.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both BuddyBoss and SureCart plugins. Set up your community features in BuddyBoss, then create corresponding products in SureCart. In the SureCart product editor, select the BuddyBoss integration and choose which features to associate with your product.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'buddyboss-platform';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'buddyboss-platform/bp-loader.php';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/buddyboss.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'BP_PLATFORM_VERSION' );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'SureCart';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://surecart.com/support/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://www.buddyboss.com/';
	}
}
