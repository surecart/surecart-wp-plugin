<?php

namespace SureCart\Integrations\Catalog;

/**
 * Conversion Bridge integration catalog listing.
 */
class ConversionBridge extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/conversion-bridge';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Conversion Bridge';
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
		return __( 'Track and optimize your marketing campaigns with comprehensive conversion tracking and attribution.', 'surecart' );
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
		<p><?php esc_html_e( 'Conversion Bridge is a powerful marketing analytics tool that helps you track and attribute conversions across multiple marketing channels.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect Conversion Bridge with SureCart to track the complete customer journey and attribute sales to your marketing efforts accurately.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Get detailed insights into which marketing channels drive the most revenue, understand your customer acquisition costs, and optimize your marketing spend.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Track conversions across multiple platforms including Google Ads, Facebook Ads, and other marketing channels in one unified dashboard.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate Conversion Bridge, then connect your SureCart store in the settings. Your conversion data will automatically start being tracked and attributed to your marketing campaigns.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/conversion-bridge.png' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'CONVERSION_BRIDGE_VERSION' );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'Conversion Bridge';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://conversionbridgewp.com/support/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://conversionbridgewp.com/integration/sure-cart/';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://conversionbridgewp.com/docs/';
	}
}
