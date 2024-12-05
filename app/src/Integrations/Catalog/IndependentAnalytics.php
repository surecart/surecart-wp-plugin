<?php

namespace SureCart\Integrations\Catalog;

/**
 * Independent Analytics integration catalog listing.
 */
class IndependentAnalytics extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/independent-analytics';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Independent Analytics';
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
		return __( 'Privacy-focused analytics that helps you understand your store performance without compromising user data.', 'surecart' );
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
		<p><?php esc_html_e( 'Independent Analytics is a privacy-first analytics solution that gives you complete control over your data while providing powerful insights.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect Independent Analytics with SureCart to track your store metrics while maintaining full data ownership and GDPR compliance.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Get detailed insights into your store\'s performance, including conversion rates, revenue tracking, and customer journey analysis.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'All data is stored on your own server, giving you complete control and independence from third-party services.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate Independent Analytics, then enable the SureCart integration in your settings. Your store data will automatically start being tracked with privacy in mind.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'independent-analytics';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'independent-analytics/independent-analytics.php';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/independent-analytics.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'INDEPENDENT_ANALYTICS_VERSION' );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'Independent Analytics';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://independentanalytics.com/support/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://independentanalytics.com/';
	}
}
