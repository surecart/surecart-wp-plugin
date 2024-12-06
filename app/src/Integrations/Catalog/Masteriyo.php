<?php

namespace SureCart\Integrations\Catalog;

/**
 * Masteriyo integration catalog listing.
 */
class Masteriyo extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/masteriyo';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Masteriyo';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Courses & Online Learning', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Integrate Masteriyo with SureCart to offer course access as a product.', 'surecart' );
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
		<p><?php esc_html_e( 'Masteriyo is a modern, user-friendly learning management system that helps you create and sell online courses effortlessly.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Sell Masteriyo courses through SureCart to enhance your course sales with a streamlined checkout process. Create flexible pricing options including one-time payments and subscriptions for your courses.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'With SureCart\'s Masteriyo integration, students gain immediate access to your courses after purchase, ensuring a seamless learning experience.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Take advantage of SureCart\'s powerful features including abandoned cart recovery, multiple payment methods, and subscription management to boost your course sales and enhance student experience.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both Masteriyo and SureCart plugins. Create your courses in Masteriyo, then create a new product in SureCart. In the product editor, select the Masteriyo integration and choose which course to associate with your product.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'learning-management-system';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'learning-management-system/lms.php';
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/masteriyo.svg' );
	}

	/**
	 * Is the plugin active?
	 *
	 * @return boolean
	 */
	public function getIsPluginActive() {
		return defined( 'MASTERIYO_VERSION' );
	}

	/**
	 * Is the integration plugin active?
	 *
	 * @return boolean
	 */
	public function getEnableLink() {
		return admin_url( 'admin.php?page=masteriyo#/add-ons' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		if ( ! class_exists( \Masteriyo\Pro\Addons::class ) ) {
			return false;
		}

		if ( ! defined( 'MASTERIYO_SURECART_INTEGRATION_ADDON_SLUG' ) ) {
			return false;
		}

		return ( new \Masteriyo\Pro\Addons() )->is_active( MASTERIYO_SURECART_INTEGRATION_ADDON_SLUG );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'Masteriyo';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://docs.masteriyo.com/free-addons/surecart-integration/';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://masteriyo.com/support/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://masteriyo.com/features/surecart-integration/';
	}
}
