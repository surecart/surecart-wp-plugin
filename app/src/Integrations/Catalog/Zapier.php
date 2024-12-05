<?php

namespace SureCart\Integrations\Catalog;

/**
 * Zapier integration catalog listing.
 */
class Zapier extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/zapier';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Zapier';
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
		return __( 'Connect SureCart with 5,000+ apps using Zapier to automate your workflows and boost productivity.', 'surecart' );
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
		<p><?php esc_html_e( 'Zapier is a powerful automation platform that connects SureCart with thousands of popular apps and services, allowing you to automate your business processes without any coding.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Create Zaps that trigger based on SureCart events like new orders, subscription changes, or refunds. Connect with CRMs, email marketing tools, accounting software, and more.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Sign up for a Zapier account and connect it with your SureCart account. Then start creating Zaps to automate your workflows using our pre-built triggers and actions.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/zapier.svg' );
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://zapier.com/apps/surecart/integrations';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://zapier.com/help/';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://zapier.com/apps/surecart/integrations';
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
}
