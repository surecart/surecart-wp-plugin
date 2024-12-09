<?php

namespace SureCart\Integrations\Catalog;

/**
 * Astra integration catalog listing.
 */
class Astra extends AbstractCatalogItem {
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
		return 'surecart/astra';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Astra';
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
		return __( 'The most popular and powerful WordPress theme. Fast, lightweight and highly customizable.', 'surecart' );
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
		<p><?php esc_html_e( 'Astra is one of the most popular WordPress themes, known for its speed, lightweight nature, and extensive customization options. It\'s perfect for creating any type of website, including e-commerce stores.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'SureCart integrates seamlessly with Astra to provide a cohesive shopping experience. Use Astra\'s customization options to style your store and create beautiful e-commerce pages that match your brand.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both Astra theme and SureCart plugin. Use the WordPress Customizer to style your store and create a professional e-commerce website.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/astra.svg' );
	}

	/**
	 * Get the docs url for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://wpastra.com/docs/integrate-surecart-with-astra/';
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'Astra';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://wpastra.com/support/';
	}

	/**
	 * Get the website url for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://wpastra.com/';
	}

	/**
	 * Get the enable link for the integration.
	 *
	 * @return string
	 */
	public function getEnableLink() {
		return 'https://wpastra.com/';
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return wp_get_theme()->get_template() === 'astra';
	}
}
