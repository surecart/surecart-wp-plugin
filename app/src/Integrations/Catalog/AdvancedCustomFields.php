<?php

namespace SureCart\Integrations\Catalog;

/**
 * Advanced Custom Fields integration catalog listing.
 */
class AdvancedCustomFields extends AbstractCatalogItem {
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
		return 'surecart/acf';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Advanced Custom Fields';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Design & Theme', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Customize WordPress with powerful, professional and intuitive fields. Create custom fields and post types easily.', 'surecart' );
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
		<p><?php esc_html_e( 'Advanced Custom Fields (ACF) is a powerful tool for customizing WordPress with custom fields and post types. It provides an intuitive interface for creating complex content structures.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect SureCart with ACF to add custom fields to your products, orders, and customer data. Create rich product descriptions and custom data structures for your e-commerce site.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both ACF and SureCart plugins. Navigate to Custom Fields in your WordPress admin to start creating custom fields for your SureCart products and orders.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/acf.svg' );
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'advanced-custom-fields';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'advanced-custom-fields/acf.php';
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return class_exists( 'ACF' );
	}
}
