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
		return __( 'A modern, lightweight, and fully customizable WordPress FSE theme built for the Gutenberg era.', 'surecart' );
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
		<p><?php esc_html_e( 'Spectra One is a modern Full Site Editing (FSE) WordPress theme that leverages the power of the Gutenberg block editor. It offers a perfect balance of performance and customization for creating stunning e-commerce websites.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'SureCart seamlessly integrates with Spectra One to deliver a modern shopping experience. Use the Full Site Editor to create and customize your store pages with beautiful, responsive designs that perfectly match your brand.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both Spectra One theme and SureCart plugin. Use the Full Site Editor to customize your store\'s design and create a professional e-commerce website.', 'surecart' ); ?></p>
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
	 * Get the docs url for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://wpspectra.com/docs/';
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'Spectra One';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://wpspectra.com/support/';
	}

	/**
	 * Get the website url for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://wpspectra.com/';
	}

	/**
	 * Get the enable link for the integration.
	 *
	 * @return string
	 */
	public function getEnableLink() {
		return 'https://wpspectra.com/';
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
