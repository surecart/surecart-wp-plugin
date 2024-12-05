<?php

namespace SureCart\Integrations\Catalog;

/**
 * Integrately integration catalog listing.
 */
class Integrately extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/integrately';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Integrately';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Automation', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Connect SureCart with 1000+ apps using Integrately to automate your business workflows.', 'surecart' );
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
		<p><?php esc_html_e( 'Integrately is a powerful automation platform that connects SureCart with thousands of popular apps and services, enabling you to automate your business processes without coding.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Create automated workflows that trigger based on SureCart events like new orders, subscription changes, or refunds. Connect with your favorite tools including CRMs, email marketing platforms, and project management software.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Sign up for an Integrately account and connect it with your SureCart account. Then start creating automated workflows using our pre-built triggers and actions.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/integrately.svg' );
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://integrately.com/integrations/surecart';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://integrately.com/support';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://integrately.com/docs';
	}
}
