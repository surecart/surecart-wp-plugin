<?php

namespace SureCart\Integrations\Catalog;

/**
 * Facebook Pixel integration catalog listing.
 */
class FacebookPixel extends AbstractCatalogItem {
	/**
	 * The priority.
	 */
	public function getPriority() {
		return 2;
	}

	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/facebook-pixel';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Facebook Pixel';
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
		return __( 'Track conversions and optimize your Facebook ads with Facebook Pixel integration.', 'surecart' );
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
		<p><?php esc_html_e( 'Facebook Pixel is a powerful analytics tool that helps you measure the effectiveness of your advertising by understanding the actions people take on your store.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect Facebook Pixel with SureCart to track customer actions, from product views to purchases, helping you optimize your Facebook ad campaigns.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Measure conversion rates, track customer behavior, and create targeted audiences based on store interactions.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Use the data to create more effective Facebook ad campaigns and improve your return on ad spend (ROAS).', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Add your Facebook Pixel code to your site. SureCart will automatically send eCommerce and conversion data to your Facebook Ads account.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'facebook-pixel';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/facebook.svg' );
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
		return 'Meta';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://www.facebook.com/business/help/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://www.facebook.com/business/tools/meta-pixel';
	}
}
