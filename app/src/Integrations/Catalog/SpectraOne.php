<?php

namespace SureCart\Integrations\Catalog;

/**
 * Spectra One integration catalog listing.
 */
class SpectraOne extends AbstractCatalogItem {
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
		return 'surecart/spectra-one';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Spectra One';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Design & Theme', 'surecart' ), __( 'Recommended', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'A modern, lightweight, and fully FSE compatible WordPress theme designed for the block editor.', 'surecart' );
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
		<p><?php esc_html_e( 'Spectra One is a modern WordPress theme built for full site editing. It provides a perfect foundation for creating beautiful, responsive websites with the WordPress block editor.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'SureCart integrates with Spectra One to provide a seamless e-commerce experience. Use the full site editor to create custom templates for your product pages, checkout forms, and customer portals.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both Spectra One theme and SureCart plugin. Use the Site Editor to customize your store\'s appearance and create a cohesive brand experience.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/spectra-one.svg' );
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'spectra-one';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'spectra-one/spectra-one.php';
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return wp_get_theme()->get_template() === 'spectra-one';
	}
}
