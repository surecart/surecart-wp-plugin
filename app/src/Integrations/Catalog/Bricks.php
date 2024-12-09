<?php

namespace SureCart\Integrations\Catalog;

/**
 * Bricks integration catalog listing.
 */
class Bricks extends AbstractCatalogItem {
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
		return 'surecart/bricks';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Bricks';
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
		return __( 'The visual site builder that helps you build beautiful, professional websites faster than ever.', 'surecart' );
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
		<p><?php esc_html_e( 'Bricks is a powerful visual site builder for WordPress that focuses on speed, stability, and a great user experience. Build professional websites with a modern, intuitive interface.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'SureCart integrates with Bricks to provide custom elements for your e-commerce pages. Design beautiful product pages, checkout forms, and customer portals using the Bricks visual builder.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both Bricks and SureCart plugins. Look for SureCart elements in the Bricks builder to start creating your e-commerce pages with a professional design.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/bricks.svg' );
	}

	/**
	 * Get the docs url for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://surecart.com/docs-category/bricks-builder/';
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
	 * Get the website url for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://bricksbuilder.io/';
	}

	/**
	 * Get the enable link for the integration.
	 *
	 * @return string
	 */
	public function getEnableLink() {
		return 'https://bricksbuilder.io/';
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return wp_get_theme()->get_template() === 'bricks';
	}
}
