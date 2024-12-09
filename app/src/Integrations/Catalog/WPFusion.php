<?php

namespace SureCart\Integrations\Catalog;

/**
 * WPFusion integration catalog listing.
 */
class WPFusion extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'wpfusion';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'WPFusion';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Customer Experience', 'surecart' ), __( 'Automation', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'The all-in-one solution to deeply integrate your WordPress website with your CRM or email marketing tool.', 'surecart' );
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
		<p><?php esc_html_e( 'FluentCRM is a powerful WordPress CRM and email marketing automation plugin that helps you manage contacts, automate marketing, and grow your business.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect SureCart with FluentCRM to automatically sync customer data, trigger email sequences based on purchases, and segment your audience based on buying behavior.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both FluentCRM and SureCart plugins. Navigate to FluentCRM settings to configure the integration and start creating automated marketing workflows.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/wpfusion.svg' );
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://wpfusion.com/';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://wpfusion.com/documentation/ecommerce/surecart/';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://wpfusion.com/contact/';
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'WPFusion';
	}

	/**
	 * Get the enable link for the integration.
	 *
	 * @return string
	 */
	public function getEnableLink() {
		return 'https://wpfusion.com/documentation/ecommerce/surecart/';
	}
}
