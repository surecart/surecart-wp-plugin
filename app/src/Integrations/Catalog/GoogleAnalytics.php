<?php

namespace SureCart\Integrations\Catalog;

/**
 * Google Analytics integration catalog listing.
 */
class GoogleAnalytics extends AbstractCatalogItem {
	/**
	 * The priority.
	 */
	public function getPriority() {
		return 1;
	}

	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/google-analytics';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Google Analytics';
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
		return __( 'Track your store performance and customer behavior with Google Analytics integration.', 'surecart' );
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
		<p><?php esc_html_e( 'Google Analytics is a powerful web analytics service that tracks and reports website traffic and user behavior.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect Google Analytics with SureCart to track your store\'s performance metrics, including sales, conversion rates, and customer behavior.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Get detailed insights into your customer journey, from initial visit to purchase completion, helping you optimize your sales funnel.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Monitor key e-commerce metrics like average order value, revenue by product, and checkout abandonment rates to make data-driven decisions.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Add your Google Analytics code to your site. SureCart will automatically send eCommerce and conversion data to your Google Analytics account.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'google-analytics';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/google-analytics.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return true;
	}

	/**
	 * Is the integration pre-installed?
	 *
	 * @return boolean
	 */
	public function getIsPreInstalled() {
		return true;
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
		return 'https://surecart.com/support';
	}

	public function getDocsLink() {
		return 'https://surecart.com/docs/track-events-with-ga/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://analytics.google.com/';
	}
}
