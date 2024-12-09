<?php

namespace SureCart\Integrations\Catalog;

/**
 * Kadence Insights integration catalog listing.
 */
class KadenceInsights extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/kadence-insights';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Kadence Insights';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Analytics', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Kadence Insights is a powerful WordPress plugin that makes A/B testing simple.', 'surecart' );
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
		<p><?php esc_html_e( 'Kadence Insights is a powerful WordPress plugin that makes A/B testing simple. Test, track, and optimize your page elements directly within WordPress, and see real-time results to make confident decisions that drive higher conversions.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect Kadence Insights with SureCart to track essential e-commerce metrics while maintaining user privacy and GDPR compliance.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Monitor conversion rates, revenue trends, and customer behavior patterns with data that stays on your server.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Get actionable insights about your store\'s performance without relying on third-party tracking services.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate Kadence Insights, then enable the SureCart integration in your Kadence Insights settings. Your store data will automatically start being tracked.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'kadence-insights';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'kadence-insights/kadence-insights.php';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/kadence.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return is_plugin_active( 'kadence-insights/kadence-insights.php' );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'Kadence';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://www.kadencewp.com/support/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://www.kadencewp.com/kadence-insights/';
	}

	/**
	 * Get the enable link for the integration.
	 *
	 * @return string
	 */
	public function getEnableLink() {
		return 'https://www.kadencewp.com/kadence-insights/';
	}
}
