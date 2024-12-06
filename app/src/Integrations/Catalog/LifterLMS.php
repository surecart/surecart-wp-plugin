<?php

namespace SureCart\Integrations\Catalog;

/**
 * LifterLMS integration catalog listing.
 */
class LifterLMS extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/lifterlms';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'LifterLMS';
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
		return __( 'Integrate LifterLMS with SureCart to offer course access as a product.', 'surecart' );
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
		<p><?php esc_html_e( 'LifterLMS is a powerful learning management system that allows you to create and manage courses, memberships, and student engagement.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Seamlessly sell LifterLMS courses and memberships through SureCart to boost your course sales and simplify your checkout process. Create compelling course offerings with flexible pricing options including one-time payments and subscriptions.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'With SureCart\'s LifterLMS integration, you can automatically grant access to your courses and memberships immediately after purchase, creating a smooth experience for your students.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Leverage SureCart\'s powerful features like abandoned cart recovery, multiple payment methods, and subscription management to increase your course sales and provide a better experience for your students.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both LifterLMS and SureCart plugins. Create your courses or memberships in LifterLMS, then create a new product in SureCart. In the product editor, select the LifterLMS integration and choose which course or membership to associate with your product.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'lifterlms';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'lifterlms/lifterlms.php';
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/lifterlms.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'LLMS_VERSION' );
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
		return 'https://lifterlms.com/';
	}
}
