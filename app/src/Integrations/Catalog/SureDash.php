<?php

namespace SureCart\Integrations\Catalog;

/**
 * SureDash integration catalog listing.
 */
class SureDash extends AbstractCatalogItem {
	/**
	 * The priority.
	 */
	public function getPriority() {
		return 0;
	}

	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/suredash';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'SureDash';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Community / Network', 'surecart' ), __( 'Courses & Online Learning', 'surecart' ), __( 'Recommended', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Integrate SureDash with SureCart to sell your online courses with a powerful checkout experience.', 'surecart' );
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
		<p><?php esc_html_e( 'SureDash is a powerful learning management system that helps you create and sell online courses effortlessly.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect SureDash with SureCart to monetize your online courses. Sell access to individual courses or course bundles through SureCart\'s optimized checkout process.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'When students purchase access through SureCart, they automatically gain entry to their purchased courses, creating a seamless learning experience.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Leverage SureCart\'s powerful features like multiple payment options, subscription management, and abandoned cart recovery to grow your online course business.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both SureDash and SureCart plugins. Set up your courses in SureDash, then create corresponding products in SureCart. In the SureCart product editor, select the SureDash integration and choose which courses to associate with your product.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'suredash';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'suredash/suredash.php';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/suredash.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'SUREDASH_VERSION' );
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
		return 'https://suredash.com/';
	}
}
